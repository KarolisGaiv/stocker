import { describe, it, expect } from 'vitest'
import { calculateTotalInvested, calculateCurrentValue } from './portfolio'

const portfolioFixture = [
  {
    name: 'Mocked Stock',
    ticker: 'MCK',
    price: 100,
    purchase_price: 300,
    quantity: 2,
    lastUpdated: '2024-04-03'
  },
  {
    name: 'Mocked Stock2 3',
    ticker: 'MCK2',
    price: 400,
    purchase_price: 300,
    quantity: 5,
    lastUpdated: '2024-04-10'
  },
  {
    name: 'Mocked Stock 3',
    ticker: 'MCK3',
    price: 3000,
    purchase_price: 300,
    quantity: 10,
    lastUpdated: '2024-04-18'
  }
]

const singleStockPortfolioFixture = [
  {
    name: 'Mocked Stock',
    ticker: 'MCK',
    price: 100,
    purchase_price: 300,
    quantity: 2,
    lastUpdated: '2024-04-03'
  }
]

describe('calculateTotalInvested function', () => {
  it('correctly calculates single stock portfolio', () => {
    const total = calculateTotalInvested(singleStockPortfolioFixture)
    expect(total).toBe(600)
  })

  it('correctly calculates total amount invested based on stock purchase price and quantities for multiple stock portfolio', () => {
    const totalInvested = 300 * 2 + 300 * 5 + 300 * 10
    const total = calculateTotalInvested(portfolioFixture)
    expect(total).toBe(totalInvested)
  })

  it('returns 0 for empty portfolio', () => {
    const portfolio: any[] = []
    const total = calculateTotalInvested(portfolio)
    expect(total).toBe(0)
  })
})

describe('calculateCurrentValue function', () => {
  it('correctly calculates single stock portfolio', () => {
    const total = calculateCurrentValue(singleStockPortfolioFixture)
    expect(total).toBe(200)
  })

  it('correctly calculates current value of multiple stock portfolio', () => {
    const correctValue = 100 * 2 + 400 * 5 + 3000 * 10
    const total = calculateCurrentValue(portfolioFixture)
    expect(total).toBe(correctValue)
  })

  it('returns 0 for empty portfolio', () => {
    const portfolio: any[] = []
    const total = calculateCurrentValue(portfolio)
    expect(total).toBe(0)
  })
})
