import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserState } from './userState'

describe('userState', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('deposit funcionality', () => {
    it('increases balance for positive input', () => {
      const userStore = useUserState()
      expect(userStore.balance).toBe(0)
      userStore.deposit(300)
      expect(userStore.balance).toBe(300)
      userStore.deposit(700)
      expect(userStore.balance).toBe(1000)
    })

    it('does not increase balance for any non-positive or zero input', () => {
      const userStore = useUserState()
      userStore.deposit(0)
      expect(userStore.balance).toBe(0)
      userStore.deposit(-300)
      expect(userStore.balance).toBe(0)
    })
  })

  describe('withdraw funcionality', () => {
    it('decreases balance succesfully', () => {
      const userStore = useUserState()
      userStore.deposit(700)
      userStore.withdraw(300)
      expect(userStore.balance).toBe(400)
    })

    it('does not allow withdraw more than there are in the balance', () => {
      const userStore = useUserState()
      userStore.deposit(700)
      expect(() => userStore.withdraw(1000)).toThrowError()
      expect(userStore.balance).toBe(700)
    })
  })

  describe('buyStock funcionality', () => {
    it('adds stock to porftolio', () => {
      const userStore = useUserState()
      userStore.deposit(1000)
      expect(userStore.portfolio).toStrictEqual([])
      const orderSize = 2
      const stock = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 300,
        lastUpdated: '2024-04-18'
      }
      userStore.buyStock(orderSize, stock)
      expect(userStore.portfolio.length).toBeGreaterThan(0)
    })

    it('adjusts balance after trade', () => {
      const userStore = useUserState()
      userStore.deposit(1000)
      const orderSize = 2
      const stock = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 300,
        lastUpdated: '2024-04-18'
      }

      const expectedBalance = userStore.balance - orderSize * stock.price
      userStore.buyStock(orderSize, stock)
      expect(userStore.balance).toBe(expectedBalance)
    })

    it('increases quanitity if stock already exist in portfolio', () => {
      const userStore = useUserState()
      userStore.deposit(30000000)
      const orderSize = 2
      const stock = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 300,
        lastUpdated: '2024-04-01'
      }
      userStore.buyStock(orderSize, stock)
      expect(userStore.portfolio[0].quantity).toBe(orderSize)

      userStore.buyStock(orderSize, stock)
      expect(userStore.portfolio[0].quantity).toBe(4)
    })
  })
})
