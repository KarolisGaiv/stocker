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

    buyStock(quantity: number, stockInfo: Stock) {
      const trade = {
        name: stockInfo.name,
        ticker: stockInfo.ticker,
        purchase_price: stockInfo.price,
        quantity,
        lastUpdated: stockInfo.lastUpdated
      }

      this.portfolio.push(trade)
      this.balance -= quantity * trade.purchase_price
    }
  }
})
