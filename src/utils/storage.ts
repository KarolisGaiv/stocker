interface User {
  balance: number
  portfolio: Stock[]
}

interface Stock {
  ticker: string
  name: string
  price: number
  lastUpdated: string
}

export const storageService = {
  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{"balance": 0, "portfolio": []}')
  },

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  },

  // Partial here makes User attributes optional
  updateUser(updates: Partial<User>): void {
    const user = this.getUser()
    const updatedUser = { ...user, ...updates }
    this.saveUser(updatedUser)
  }
}
