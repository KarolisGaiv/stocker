import { describe, it, expect } from 'vitest'
import {
  calculateTotalInvested,
  calculateCurrentValue,
  calculatePortfolioReturn,
  calculateStockPercentageOfPortfolio
} from './portfolio'

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

const singleStockFixture = {
  name: 'Mocked Stock',
  ticker: 'MCK',
  price: 100,
  purchase_price: 300,
  quantity: 2,
  lastUpdated: '2024-04-03'
}

describe('calculateTotalInvested function', () => {
  it('correctly calculates for a single stock object', () => {
    const total = calculateTotalInvested(singleStockFixture)
    expect(total).toBe(600)
  })

  it('correctly calculates for a single stock portfolio', () => {
    const total = calculateTotalInvested([singleStockFixture])
    expect(total).toBe(600)
  })

  it('correctly calculates total amount invested for multiple stock portfolio', () => {
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
  it('correctly calculates for a single stock', () => {
    const total = calculateCurrentValue(singleStockFixture)
    expect(total).toBe(200)
  })

  it('correctly calculates single stock portfolio', () => {
    const total = calculateCurrentValue(singleStockFixture)
    expect(total).toBe(200)
  })

  it('correctly calculates current value of multiple stocks portfolio', () => {
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

describe('calculatePortfolioReturn function', () => {
  it('correctly calculates positive portfolio returns', () => {
    const investedValue = 10000
    const currentValue = 12000
    const expectedReturn = ((12000 - 10000) / 10000) * 100
    const calculatedReturn = calculatePortfolioReturn(currentValue, investedValue)
    expect(calculatedReturn).toBe(expectedReturn)
  })

  it('correctly calculates negative portfolio returns', () => {
    const investedValue = 10000
    const currentValue = 8000
    const expectedReturn = ((8000 - 10000) / 10000) * 100
    const calculatedReturn = calculatePortfolioReturn(currentValue, investedValue)
    expect(calculatedReturn).toBe(expectedReturn)
  })

  it('calculates zero return when current value equals invested value', () => {
    const investedValue = 10000
    const currentValue = 10000
    const expectedReturn = ((10000 - 10000) / 10000) * 100
    const calculatedReturn = calculatePortfolioReturn(currentValue, investedValue)
    expect(calculatedReturn).toBe(expectedReturn)
  })

  it('returns 0 if portfolio has no holdings', () => {
    const investedValue = 0
    const currentValue = 1000
    const calculatedReturn = calculatePortfolioReturn(currentValue, investedValue)
    expect(calculatedReturn).toBe(0)
  })
})

describe('calculateStockPercentageOfPortfolio', () => {
  it('calculates share part of total portfolio holdings', () => {
    const currentSharesValue = 1000
    const currentPortfolioValue = 10000
    expect(calculateStockPercentageOfPortfolio(currentSharesValue, currentPortfolioValue)).toBe(10)
  })
})
