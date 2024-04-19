import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserState } from './userState'

interface Stock {
  name: string
  ticker: string
  price: number
  purchase_price: number
  quantity: number
  lastUpdated: string
}

const stockFixture = {
  name: 'Mocked Stock',
  ticker: 'MCK',
  price: 300,
  purchase_price: 300,
  quantity: 2,
  lastUpdated: '2024-04-18'
}

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
      expect(userStore.balance).toBe(0)
      userStore.deposit(300)
      expect(userStore.balance).toBe(300)
      expect(userStore.updateUser).toHaveBeenCalledWith({ balance: 300 })
      userStore.deposit(700)
      expect(userStore.balance).toBe(1000)
      expect(userStore.updateUser).toHaveBeenCalledWith({ balance: 1000 })
    })

    it('does not increase balance for any non-positive or zero input', () => {
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
      userStore.deposit(700)
      userStore.withdraw(300)
      expect(userStore.balance).toBe(400)
      expect(userStore.updateUser).toHaveBeenCalledWith({ balance: 400 })
    })

    it('does not allow withdraw more than there are in the balance', () => {
      userStore.deposit(700)
      expect(userStore.updateUser).toHaveBeenCalledTimes(1)

      expect(() => userStore.withdraw(1000)).toThrowError()
      expect(userStore.updateUser).toHaveBeenCalledTimes(1)
      expect(userStore.balance).toBe(700)
    })
  })

  describe('buyStock funcionality', () => {
    it('adds stock to porftolio', () => {
      userStore.deposit(1000)
      expect(userStore.balance).toBe(1000)
      expect(userStore.portfolio).toStrictEqual([])
      expect(userStore.portfolio.length).toBe(0)

      userStore.buyStock(2, { ...stockFixture })

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
      userStore.deposit(1000)

      const expectedBalance = userStore.balance - 2 * stockFixture.price
      userStore.buyStock(2, { ...stockFixture })
      expect(userStore.balance).toBe(expectedBalance)
    })

    it('increases quanitity if stock already exist in portfolio', () => {
      userStore.deposit(30000000)
      expect(userStore.portfolio.length).toBe(0)

      userStore.buyStock(2, { ...stockFixture })
      expect(userStore.portfolio[0].quantity).toBe(2)

      userStore.buyStock(2, { ...stockFixture })
      expect(userStore.portfolio[0].quantity).toBe(4)
    })

    it('saves average purchase price if stock is bought several times', () => {
      userStore.deposit(30000000)

      userStore.buyStock(2, { ...stockFixture })

      const stock2 = { ...stockFixture, purchase_price: 600 }
      userStore.buyStock(2, stock2)

      const totalSpent = stockFixture.price * 2 + stock2.price * 2
      const totalQuantity = 2 + 2
      const avgPurchasePrice = totalSpent / totalQuantity

      expect(userStore.portfolio[0].purchase_price).toBeCloseTo(avgPurchasePrice)
    })

    it('does not allow to buy more than available balance', () => {
      userStore.deposit(1000)

      expect(() => userStore.buyStock(10000, { ...stockFixture })).toThrowError()
    })
  })

  describe('sell stock function', () => {
    it('does not allow to sell stocks which are not in portfolio', () => {
      expect(() => userStore.sellStock(2, { ...stockFixture })).toThrowError()
    })

    it('does not allow to sell more stocks than user holds in portfolio', () => {
      userStore.deposit(1000)

      userStore.buyStock(2, { ...stockFixture })
      expect(userStore.portfolio[0].quantity).toBe(2)

      expect(() => userStore.sellStock(10, { ...stockFixture })).toThrowError(
        'Cannot sell more than currently have'
      )
      expect(userStore.portfolio[0].quantity).toBe(2)
    })

    it('subtracts necessary quantity from portoflio', () => {
      userStore.deposit(50000)
      userStore.buyStock(10, { ...stockFixture })
      userStore.sellStock(5, { ...stockFixture })
      expect(userStore.portfolio[0].quantity).toBe(10 - 5)
    })

    it('deletes stock from portfolio if user sells all stock holdings', () => {
      userStore.deposit(50000)
      userStore.buyStock(10, { ...stockFixture })
      expect(userStore.portfolio.length).toBe(1)
      expect(userStore.portfolio[0]).toMatchObject({
        name: 'Mocked Stock',
        ticker: 'MCK',
        purchase_price: 300,
        quantity: 10,
        lastUpdated: '2024-04-18'
      })

      userStore.sellStock(5, { ...stockFixture })
      expect(userStore.portfolio[0]).toMatchObject({
        name: 'Mocked Stock',
        ticker: 'MCK',
        purchase_price: 300,
        quantity: 5,
        lastUpdated: '2024-04-18'
      })

      userStore.sellStock(5, { ...stockFixture })
      expect(userStore.portfolio.length).toBe(0)
    })

    it('updates user balance after sale completion', () => {
      userStore.deposit(1000)
      userStore.buyStock(2, { ...stockFixture })
      expect(userStore.balance).toBe(400)

      userStore.sellStock(1, { ...stockFixture })
      expect(userStore.balance).toBe(700)
    })
  })
})
