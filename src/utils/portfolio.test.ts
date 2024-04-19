import { describe, it, expect } from 'vitest'
import { calculateTotalInvested } from './portfolio'

const portfolioFixture = [
  {
    name: 'Mocked Stock',
    ticker: 'MCK',
    price: 300,
    purchase_price: 300,
    quantity: 2,
    lastUpdated: '2024-04-03'
  },
  {
    name: 'Mocked Stock2 3',
    ticker: 'MCK2',
    price: 300,
    purchase_price: 300,
    quantity: 5,
    lastUpdated: '2024-04-10'
  },
  {
    name: 'Mocked Stock 3',
    ticker: 'MCK3',
    price: 300,
    purchase_price: 300,
    quantity: 10,
    lastUpdated: '2024-04-18'
  }
]

describe('calculateTotalInvested function', () => {
  it('correctly calculates total amount invested based on stock purchase price and quantities', () => {
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
