import { defineStore } from 'pinia'
import { storageService } from '@/utils/storage'
import { getStockPrice } from '@/api/stock_api'
import { format } from 'date-fns'
import { useToast } from 'vue-toastification'

const MAX_PORTFOLIO_SIZE = 5

interface User {
  balance: number
  portfolio: Stock[]
}

interface Stock {
  ticker: string
  name: string
  price: number
  purchase_price: number
  lastUpdated: string
  quantity: number
}

const toast = useToast()

export const useUserState = defineStore('user', {
  state: (): User => {
    return {
      balance: 0,
      portfolio: []
    }
  },

  actions: {
    loadUser() {
      const user = storageService.getUser()
      if (user) {
        this.balance = user.balance
        this.portfolio = user.portfolio
      }
    },

    updateUser(updates: Partial<User>) {
      storageService.updateUser(updates)
      this.loadUser() // reload user to show updates
    },

    deposit(amount: number) {
      if (amount > 0) {
        this.updateUser({ balance: parseFloat((this.balance + amount).toFixed(2)) })
      }
    },

    withdraw(amount: number) {
      if (amount > 0 && amount <= this.balance) {
        this.updateUser({ balance: parseFloat((this.balance - amount).toFixed(2)) })
      } else {
        throw new Error('Insufficient balance')
      }
    },

    buyStock(orderQuantity: number, orderInfo: Stock) {
      const totalOrderPrice = orderQuantity * orderInfo.price

      if (totalOrderPrice > this.balance) {
        throw new Error('Insufficient balance')
      }

      const existingStockIndex = this.findStockIndex(orderInfo.ticker)

      // if stock exists in portfolio, update quantity and purchase price
      if (existingStockIndex !== -1) {
        this.updateExistingStock(
          orderInfo.ticker,
          orderInfo.price,
          orderQuantity,
          orderInfo.lastUpdated
        )
      } else {
        // if stock does not exist and portfolio is at max size, throw error
        if (this.portfolio.length === MAX_PORTFOLIO_SIZE) {
          throw new Error(`Cannot have more than ${MAX_PORTFOLIO_SIZE} stocks in portfolio`)
        }

        // if stock does not exist, add to portfolio
        this.addNewStock(orderQuantity, orderInfo)
      }

      this.balance -= totalOrderPrice
      this.balance = parseFloat(this.balance.toFixed(2))

      this.updateUser({ balance: this.balance, portfolio: this.portfolio })
    },

    sellStock(orderQuantity: number, orderInfo: Stock) {
      const existingStockIndex = this.portfolio.findIndex(
        (stock) => stock.ticker === orderInfo.ticker
      )

      if (existingStockIndex === -1) {
        throw new Error('Stock not found in portfolio')
      }

      if (orderQuantity > this.portfolio[existingStockIndex].quantity) {
        throw new Error('Cannot sell more than currently have')
      }

      if (orderQuantity === this.portfolio[existingStockIndex].quantity) {
        this.portfolio.splice(existingStockIndex, 1)
      } else {
        this.portfolio[existingStockIndex].quantity -= orderQuantity
      }

      this.balance += orderQuantity * orderInfo.price
      this.balance = parseFloat(this.balance.toFixed(2))
      this.updateUser({ balance: this.balance, portfolio: this.portfolio })
    },

    async updatePortfolioPrices(): Promise<void> {
      const today = format(new Date(), 'yyyy-MM-dd')
      let updated = false

      for (const stock of this.portfolio) {
        if (stock.lastUpdated < today) {
          try {
            const response = await getStockPrice(stock.ticker)
            if (response && response.status === 'OK' && response.results.length > 0) {
              const newPrice = response.results[0].o
              stock.price = newPrice
              stock.lastUpdated = today
              updated = true
            } else {
              toast.error('No valid data for stock')
            }
          } catch {
            toast.error(`Failed to update stock price for ${stock.name}`)
          }
        }
      }
      if (updated) {
        this.updateUser({ portfolio: this.portfolio })
      }
    },

    findStockIndex(ticker: string) {
      return this.portfolio.findIndex((stock) => stock.ticker === ticker.toUpperCase())
    },

    updateExistingStock(
      ticker: string,
      orderPrice: number,
      orderQuantity: number,
      updateDate: string
    ) {
      const existingStockPosition = this.getStockFromPortfolio(ticker)

      if (!existingStockPosition) {
        throw new Error(
          `Invariant failed: expected stock with ticker ${ticker} to be in the portfolio`
        )
      }

      const oldTotalCost = existingStockPosition.purchase_price * existingStockPosition.quantity
      const newTotalCost = oldTotalCost + orderPrice * orderQuantity
      existingStockPosition.quantity += orderQuantity

      existingStockPosition.purchase_price = parseFloat(
        (newTotalCost / existingStockPosition.quantity).toFixed(2)
      )
      existingStockPosition.lastUpdated = updateDate
    },

    addNewStock(orderQuantity: number, orderInfo: Stock) {
      const trade = {
        name: orderInfo.name,
        ticker: orderInfo.ticker,
        price: orderInfo.price,
        purchase_price: orderInfo.price,
        quantity: orderQuantity,
        lastUpdated: orderInfo.lastUpdated
      }
      this.portfolio.push(trade)
    },

    getStockFromPortfolio(ticker: string) {
      return this.portfolio.find((stock) => stock.ticker === ticker.toUpperCase())
    }
  }
})
