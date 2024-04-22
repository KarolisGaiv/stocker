import { format, subMonths } from 'date-fns'

const api_key = import.meta.env.VITE_STOCK_API_KEY

async function getStockPrice(stock: string) {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stock}/prev?adjusted=true&apiKey=${api_key}`
    )
    return response.json()
  } catch (error) {
    console.error('Error fetching data: ', error)
    return null
  }
}

async function getStockInformation(stock: string) {
  try {
    const res = await fetch(
      `https://api.polygon.io/v3/reference/tickers/${stock}?apiKey=${api_key}`
    )
    return res.json()
  } catch (err) {
    console.error('Error, fetching data', err)
    return null
  }
}

async function getStockNews(stock: string) {
  try {
    const res = await fetch(
      `https://api.polygon.io/v2/reference/news?ticker=${stock}&apiKey=${api_key}`
    )
    return res.json()
  } catch (err) {
    console.error('Error fetching data: ', err)
    return null
  }
}

async function getMonthPriceHistory(stock: string) {
  stock = stock.toUpperCase()
  const today = format(new Date(), 'yyyy-MM-dd')
  const from = format(subMonths(new Date(), 1), 'yyyy-MM-dd')

  try {
    const res =
      await fetch(`https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${from}/${today}?adjusted=true&sort=asc&limit=120&apiKey=${api_key}
    `)
    return res.json()
  } catch (err) {
    console.error('Error while fetching historical data:', err)
    return null
  }
}

export { getStockPrice, getStockInformation, getStockNews, getMonthPriceHistory }
