import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserState } from './userState'

describe('userState', () => {
  let userStore: ReturnType<typeof useUserState>

  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserState()

    vi.spyOn(userStore, 'updateUser').mockImplementation((updates) => {
      Object.assign(userStore, updates)
    })
  })

  describe('deposit funcionality', () => {
    it('increases balance for positive input', () => {
      const userStore = useUserState()
      expect(userStore.balance).toBe(0)
      userStore.deposit(300)
      expect(userStore.balance).toBe(300)
      expect(userStore.updateUser).toHaveBeenCalledWith({ balance: 300 })
      userStore.deposit(700)
      expect(userStore.balance).toBe(1000)
      expect(userStore.updateUser).toHaveBeenCalledWith({ balance: 1000 })
    })

    it('does not increase balance for any non-positive or zero input', () => {
      const userStore = useUserState()
      userStore.deposit(0)
      expect(userStore.balance).toBe(0)
      expect(userStore.updateUser).not.toHaveBeenCalledWith({ balance: 0 })
      userStore.deposit(-300)
      expect(userStore.balance).toBe(0)
      expect(userStore.updateUser).not.toHaveBeenCalled()
    })
  })

  describe('withdraw funcionality', () => {
    it('decreases balance succesfully', () => {
      const userStore = useUserState()
      userStore.deposit(700)
      userStore.withdraw(300)
      expect(userStore.balance).toBe(400)
      expect(userStore.updateUser).toHaveBeenCalledWith({ balance: 400 })
    })

    it('does not allow withdraw more than there are in the balance', () => {
      const userStore = useUserState()
      userStore.deposit(700)
      expect(userStore.updateUser).toHaveBeenCalledTimes(1)

      expect(() => userStore.withdraw(1000)).toThrowError()
      expect(userStore.updateUser).toHaveBeenCalledTimes(1)
      expect(userStore.balance).toBe(700)
    })
  })

  describe('buyStock funcionality', () => {
    it('adds stock to porftolio', () => {
      const userStore = useUserState()
      userStore.deposit(1000)
      expect(userStore.balance).toBe(1000)
      expect(userStore.portfolio).toStrictEqual([])
      expect(userStore.portfolio.length).toBe(0)

      const orderSize = 2
      const stock = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 300,
        lastUpdated: '2024-04-18'
      }
      userStore.buyStock(orderSize, stock)

      expect(userStore.portfolio.length).toBe(1)
      expect(userStore.portfolio[0]).toMatchObject({
        name: 'Mocked Stock',
        ticker: 'MCK',
        purchase_price: 300,
        quantity: 2,
        lastUpdated: '2024-04-18'
      })
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
      expect(userStore.portfolio.length).toBe(0)

      const orderSize = 2
      const stock = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 300,
        lastUpdated: '2024-04-01'
      }
      userStore.buyStock(orderSize, stock)
      expect(userStore.portfolio[0].quantity).toBe(2)

      userStore.buyStock(orderSize, stock)
      expect(userStore.portfolio[0].quantity).toBe(4)
    })

    it('saves average purchase price if stock is bought several times', () => {
      const userStore = useUserState()
      userStore.deposit(30000000)
      const orderSize = 2
      const stock1 = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 300,
        lastUpdated: '2024-04-01'
      }
      userStore.buyStock(orderSize, stock1)
      expect(userStore.portfolio[0].purchase_price).toBe(stock1.price)

      const stock2 = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 600,
        lastUpdated: '2024-04-10'
      }
      userStore.buyStock(orderSize, stock2)

      const totalSpent = stock1.price * orderSize + stock2.price * orderSize
      const totalQuantity = orderSize + orderSize
      const avgPurchasePrice = totalSpent / totalQuantity

      expect(userStore.portfolio[0].purchase_price).toBeCloseTo(avgPurchasePrice)
    })

    it('does not allow to buy more than available balance', () => {
      const userStore = useUserState()
      userStore.deposit(1000)
      const stock = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 300,
        lastUpdated: '2024-04-01'
      }
      expect(() => userStore.buyStock(1000, stock)).toThrowError()
    })
  })

  describe.skip('sell stock function', () => {
    it('does not allow to sell stocks which are not in portfolio', () => {
      const userStore = useUserState()
      const stock = {
        ticker: 'MCK'
      }
      expect(() => userStore.sellStock(2, stock)).toThrowError()
    })

    it('does not allow to sell more stocks than user holds in portfolio', () => {
      const userStore = useUserState()
      userStore.deposit(1000)
      const stock = {
        name: 'Mocked Stock',
        ticker: 'MCK',
        price: 300,
        lastUpdated: '2024-04-01'
      }
      userStore.buyStock(2, stock)
      expect(userStore.portfolio[0].quantity).toBe(2)

      expect(() => userStore.sellStock(10, stock)).toThrowError()
      expect(userStore.portfolio[0].quantity).toBe(2)
    })
  })
})
