import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserState } from './userState'
import { format, subDays } from 'date-fns'
import { storageService } from '@/utils/storage'

import * as stock_api from '../api/stock_api'

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

    it('does not allow to buy more than 5 stocks  in total', () => {
      userStore.deposit(1000)

      userStore.portfolio = Array.from({ length: 5 }, (_, i) => ({
        ...stockFixture,
        ticker: `MKCD${i + 1}`
      }))

      expect(() => userStore.buyStock(1, { ...stockFixture })).toThrowError(
        'Cannot have more than 5 stocks in portfolio'
      )
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

  describe('updatePortfolioPrices function', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('updates prices for stocks not updated today', async () => {
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
      const today = format(new Date(), 'yyyy-MM-dd')

      const stockUpdatedYesterday = {
        ...stockFixture,
        lastUpdated: yesterday,
        price: 250
      }

      const stockUpdatedToday = {
        ...stockFixture,
        lastUpdated: today,
        price: 300
      }

      userStore.portfolio = [stockUpdatedYesterday, stockUpdatedToday]

      //mock api call that fetches stock price
      const mockApiResponse = {
        status: 'OK',
        results: [{ o: 420 }]
      }

      vi.spyOn(stock_api, 'getStockPrice').mockResolvedValue(mockApiResponse)

      await userStore.updatePortfolioPrices()

      // check if stockUpdatedYesterday object was updated
      expect(userStore.portfolio[0].price).toBe(420)
      expect(userStore.portfolio[0].lastUpdated).toBe(today)

      // check if stockUpdatedToday object was not updated
      expect(userStore.portfolio[1].price).toBe(300)
      expect(userStore.portfolio[1].lastUpdated).toBe(today)

      expect(userStore.updateUser).toHaveBeenCalledWith({
        portfolio: userStore.portfolio
      })
    })

    it('does not call API for stocks updated today', async () => {
      const today = format(new Date(), 'yyyy-MM-dd')

      const stockUpdatedToday = {
        ...stockFixture,
        lastUpdated: today,
        price: 500
      }

      const stockUpdatedToday2 = {
        ...stockFixture,
        lastUpdated: today,
        price: 400
      }

      userStore.portfolio = [stockUpdatedToday, stockUpdatedToday2]
      const spy = vi.spyOn(stock_api, 'getStockPrice')
      await userStore.updatePortfolioPrices()

      expect(spy).not.toHaveBeenCalled()
      expect(stockUpdatedToday.price).toBe(500)
      expect(stockUpdatedToday.lastUpdated).toBe(today)
      expect(stockUpdatedToday2.price).toBe(400)
      expect(stockUpdatedToday2.lastUpdated).toBe(today)

      expect(userStore.updateUser).not.toHaveBeenCalled()
    })

    it('does nothing for empty portfolio', async () => {
      userStore.portfolio = []
      const spy = vi.spyOn(stock_api, 'getStockPrice')
      await userStore.updatePortfolioPrices()

      expect(spy).not.toHaveBeenCalled()
    })

    it('does not update user data if API call fails', async () => {
      vi.spyOn(stock_api, 'getStockPrice').mockRejectedValue(new Error('Failed to fetch price'))

      await userStore.updatePortfolioPrices()

      expect(userStore.updateUser).not.toHaveBeenCalled()
    })
  })

  describe('getStockFromPortfolio function', () => {
    it('gets stock object from portfolio based on provided ticker', () => {
      userStore.portfolio = [stockFixture]
      const tickerToFind = 'MCK'
      const result = userStore.getStockFromPortfolio(tickerToFind)

      expect(result).toEqual(stockFixture)
    })
  })

  describe('userState - loadUser method', () => {
    beforeEach(() => {
      vi.spyOn(storageService, 'getUser').mockReturnValue({
        balance: 100,
        portfolio: [stockFixture]
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should load user data if storage returns a user', () => {
      expect(userStore.balance).toBe(0)
      expect(userStore.portfolio.length).toBe(0)

      userStore.loadUser()

      expect(userStore.balance).toBe(100)
      expect(userStore.portfolio).toContainEqual(stockFixture)
    })
  })
})
