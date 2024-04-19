import { getStockPrice } from './stock_api'
import { describe, expect, vi, it } from 'vitest'

global.fetch = vi.fn()

describe('getStockPrice function ', () => {
  it('fetches stock price successfully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () =>
        Promise.resolve({
          ticker: 'MCKD',
          results: [{ o: 123 }],
          status: 'OK'
        })
    } as Response)

    const stock = 'MCKD'
    const stockData = await getStockPrice(stock)

    expect(stockData).toEqual({
      ticker: 'MCKD',
      results: [{ o: 123 }],
      status: 'OK'
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`https://api.polygon.io/v2/aggs/ticker/${stock}/prev?adjusted=true`)
    )
  })
  it('handles failed fetch', async () => {
    const errorMessage = 'Failed to fetch data'
    vi.mocked(fetch).mockRejectedValue(new Error(errorMessage))

    const stock = 'MCK'
    const stockData = await getStockPrice(stock)

    expect(stockData).toBe(null)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`https://api.polygon.io/v2/aggs/ticker/${stock}/prev?adjusted=true`)
    )
  })
})
