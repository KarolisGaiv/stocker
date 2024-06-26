import { getStockPrice, getStockInformation, getStockNews, getMonthPriceHistory } from './stock_api'
import { describe, expect, vi, it } from 'vitest'
import { format, subMonths } from 'date-fns'

global.fetch = vi.fn()

describe('getStockPrice function ', () => {
  it('fetches stock price successfully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
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

  it('throws error after unsuccessfull data fetch', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('API Error'))
    const stock = 'MCKD'
    await expect(getStockPrice(stock)).rejects.toThrow()
  })

  it('converts stock ticker to upper case in fetch request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ticker: 'MCKD',
          results: [{ o: 123 }],
          status: 'OK'
        })
    } as Response)
    const stock = 'tsla'
    await getStockPrice(stock)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/TSLA/prev'))
  })
})

describe('getStockInformation function', () => {
  it('fetches stock information successfully', async () => {
    const mockResponse = {
      name: 'Tesla Inc',
      ticker: 'TSLA',
      market: 'stocks'
    }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response)

    const stock = 'TSLA'
    const stockInfo = await getStockInformation(stock)
    expect(stockInfo).toEqual(mockResponse)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/reference/tickers/${stock}`))
  })

  it('throws error after unsuccessfull data fetch', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network Error'))
    const stock = 'TSLA'
    await expect(getStockPrice(stock)).rejects.toThrow()
  })

  it('converts stock ticker to upper case in fetch request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ticker: 'MCKD',
          results: [{ o: 123 }],
          status: 'OK'
        })
    } as Response)
    const stock = 'mckd'
    await getStockPrice(stock)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/MCKD/prev'))
  })
})

describe('getStockNews function', () => {
  it('fetches stock news successfully', async () => {
    const mockResponse = {
      name: 'Tesla Inc',
      ticker: 'TSLA',
      news: [{ name: 'article1' }, { name: 'article12' }]
    }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response)

    const stock = 'TSLA'
    const news = await getStockNews(stock)
    expect(news).toEqual(mockResponse)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/reference/news?ticker=${stock}&`))
  })

  it('throws error after unsuccessfull data fetch', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network Error'))
    const stock = 'TSLA'
    await expect(getStockPrice(stock)).rejects.toThrow()
  })

  it('converts stock ticker to upper case in fetch request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'Tesla Inc',
          ticker: 'TSLA',
          news: [{ name: 'article1' }, { name: 'article12' }]
        })
    } as Response)
    const stock = 'mckd'
    await getStockNews(stock)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('news?ticker=MCKD&'))
  })
})

describe('getMonthPriceHistory function', () => {
  it('fetches month price history successfully', async () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const oneMonthAgo = format(subMonths(new Date(), 1), 'yyyy-MM-dd')
    const mockResponse = {
      ticker: 'TSLA',
      adjusted: true,
      results: [{ close: 123 }, { close: 123 }, { close: 123 }, { close: 123 }]
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response)

    const stock = 'tsla'
    await getMonthPriceHistory(stock)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/ticker/TSLA/range/1/day/${oneMonthAgo}/${today}?`)
    )
  })

  it('throws error after unsuccessfull data fetch', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network Error'))
    const stock = 'TSLA'
    await expect(getStockPrice(stock)).rejects.toThrow()
  })
})
