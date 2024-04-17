interface User {
  username: string
  password: string
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
    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))
  },

  doesUserExists(username: string): boolean {
    const users = this.getUsers()
    return users.some((user) => user.username === username)
  },

  validateUser(username: string, password: string): boolean {
    const users = this.getUsers()
    return users.some((user) => user.username === username && user.password === password)
  }
}
