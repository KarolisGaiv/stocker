import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storageService } from './storage'

vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn()
})

const mockStock = {
  name: 'Mocked Stock',
  ticker: 'MCK',
  price: 100,
  purchase_price: 300,
  quantity: 2,
  lastUpdated: '2024-04-03'
}

describe('storage service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getUser method', () => {
    it('returns default user profile if localStorage is empty', () => {
      const user = storageService.getUser()
      expect(user).toEqual({ balance: 0, portfolio: [] })
      expect(localStorage.getItem).toHaveBeenCalledWith('user')
    })

    it('returns saved user profile from localStorage', () => {
      const mockUser = { balance: 100, portfolio: [mockStock] }
      //@ts-ignore
      localStorage.getItem.mockReturnValue(JSON.stringify(mockUser))
      const user = storageService.getUser()
      expect(user).toEqual(mockUser)
    })
  })

  describe('saveUser method', () => {
    it('saves user to localStorage', () => {
      const defaultUser = storageService.getUser()
      expect(defaultUser).toEqual({ balance: 0, portfolio: [] })

      const newUser = { balance: 100, portfolio: [mockStock] }
      storageService.saveUser(newUser)
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(newUser))
    })
  })

  describe('updateUser method', () => {
    it('updates user data corectly', () => {
      const originalUser = { balance: 100, portfolio: ['AAPL'] }
      //@ts-ignore
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(originalUser))
      const updates = { balance: 2000 }

      storageService.updateUser(updates)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({
          balance: 2000,
          portfolio: ['AAPL']
        })
      )
    })
  })
})
