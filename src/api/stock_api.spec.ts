import { skip } from 'node:test'
import { getStockPrice } from './stock_api'
import { describe, expect, vi, it } from 'vitest'

global.fetch = vi.fn()

const MOCK_STOCK = {
  ticker: 'MCKD',
  results: [{ o: 123 }],
  status: 'OK'
}

describe('getStockPrice function ', () => {
  it('fetches stock price successfully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve(MOCK_STOCK)
    } as Response)

    const stock = 'MCKD'
    const stockData = await getStockPrice(stock)

    expect(stockData).toEqual(MOCK_STOCK)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`https://api.polygon.io/v2/aggs/ticker/${stock}/prev?adjusted=true`)
    )
  })
  it.skip('add test for unsucsessfull fetch attempt')
})
