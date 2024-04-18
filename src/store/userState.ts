import { defineStore } from 'pinia'
import { storageService } from '@/utils/storage'

interface User {
  balance: number
  portfolio: Stock[]
}

interface Stock {
  ticker: string
  name: string
  price: number
  lastUpdated: string
  quantity: number
}

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
        this.updateUser({ balance: this.balance + amount })
      }
    },

    withdraw(amount: number) {
      if (amount > 0 && amount <= this.balance) {
        this.updateUser({ balance: this.balance - amount })
      } else {
        throw new Error('Insufficient balance')
      }
    },

    buyStock(orderQuantity: number, orderInfo: Stock) {
      const existingStockIndex = this.portfolio.findIndex(
        (stock) => stock.ticker === orderInfo.ticker
      )

      // if stock already exist in portfolio update quantity
      if (existingStockIndex !== -1) {
        this.portfolio[existingStockIndex].quantity += orderQuantity
      } else {
        const trade = {
          name: orderInfo.name,
          ticker: orderInfo.ticker,
          purchase_price: orderInfo.price,
          quantity: orderQuantity,
          lastUpdated: orderInfo.lastUpdated
        }
        this.portfolio.push(trade)
      }
      this.balance -= orderQuantity * orderInfo.price
    }
  }
})
