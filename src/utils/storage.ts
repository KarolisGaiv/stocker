interface User {
  username: string
  password: string
  balance: number
  portfolio: any[]
}

export const storageService = {
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]')
  },

  /**
   * Save a new user to localStorage
   * @param user The user object to store
   */
  saveUser(user: User): void {
    const users = this.getUsers()
    users.push({
      ...user,
      balance: 0,
      portfolio: []
    })
    localStorage.setItem('users', JSON.stringify(users))
  },

  doesUserExists(username: string): boolean {
    const users = this.getUsers()
    return users.some((user) => user.username === username)
  },

  validateUser(username: string, password: string): boolean {
    const users = this.getUsers()
    return users.some((user) => user.username === username && user.password === password)
  },

  getUser(username: string): User | undefined {
    const users = this.getUsers()
    return users.find((user) => user.username === username)
  },

  // Partial makes all User properties optional to be provided
  updateUser(username: string, updates: Partial<User>): void {
    const users = this.getUsers()
    const updatedUsers = users.map((user) => {
      if (user.username === username) {
        return { ...user, ...updates }
      }
      return user
    })
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }
}
