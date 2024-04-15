import { skip } from 'node:test'
import { getStockData } from './stock_api'
import { describe, expect, vi, it } from 'vitest'

global.fetch = vi.fn()

const MOCK_STOCK = {
  ticker: 'MCKD',
  results: [{ o: 123 }],
  status: 'OK'
}

describe('getStockData function ', () => {
  it('fetches stock data successfully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve(MOCK_STOCK)
    } as Response)

    const stock = 'MCKD'
    const stockData = await getStockData(stock)

    expect(stockData).toEqual(MOCK_STOCK)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`https://api.polygon.io/v2/aggs/ticker/${stock}/prev?adjusted=true`)
    )
  })
  it.skip('add test for unsucsessfull fetch attempt')
})
