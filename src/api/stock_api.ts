import { format, subMonths } from 'date-fns'
import { useToast } from 'vue-toastification'

const api_key = import.meta.env.VITE_STOCK_API_KEY
const toast = useToast()

async function getStockPrice(stock: string) {
  stock = stock.toUpperCase()
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stock}/prev?adjusted=true&apiKey=${api_key}`
    )
    return handleAPIResponse(response)
  } catch (error) {
    handleError('Failed to fetch stock prices')
  }
}

async function getStockInformation(stock: string) {
  stock = stock.toUpperCase()
  try {
    const response = await fetch(
      `https://api.polygon.io/v3/reference/tickers/${stock}?apiKey=${api_key}`
    )
    return handleAPIResponse(response)
  } catch (error) {
    handleError('Failed to fetch stock information')
  }
}

async function getStockNews(stock: string) {
  stock = stock.toUpperCase()
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/reference/news?ticker=${stock}&apiKey=${api_key}`
    )
    return handleAPIResponse(response)
  } catch (error) {
    handleError('Failed to fetch stock news')
  }
}

async function getMonthPriceHistory(stock: string) {
  stock = stock.toUpperCase()
  const today = format(new Date(), 'yyyy-MM-dd')
  const from = format(subMonths(new Date(), 1), 'yyyy-MM-dd')

  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${from}/${today}?adjusted=true&sort=asc&limit=120&apiKey=${api_key}`
    )
    return handleAPIResponse(response)
  } catch (error) {
    handleError('Failed to fetch price history')
  }
}

async function handleAPIResponse(response: Response) {
  if (!response.ok) {
    const errData = await response.json()
    let errorMessage = 'An unexpected error occured'

    if (errData.error) {
      errorMessage = errData.error
    } else if (errData.message) {
      errorMessage = errData.message
    }
    throw new Error(errorMessage)
  }
  return await response.json()
}

function handleError(message: string) {
  toast.error(message)
  throw new Error(message)
}

export { getStockPrice, getStockInformation, getStockNews, getMonthPriceHistory }
