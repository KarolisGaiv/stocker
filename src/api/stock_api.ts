import { format, subMonths } from 'date-fns'
import { useToast } from 'vue-toastification'

const api_key = import.meta.env.VITE_STOCK_API_KEY
const toast = useToast()

async function getStockPrice(stock: string) {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stock}/prev?adjusted=true&apiKey=${api_key}`
    )
    return handleAPIResponse(response)
  } catch (error) {
    toast.error('Network error or service unavailable')
    return null
  }
}

async function getStockInformation(stock: string) {
  try {
    const res = await fetch(
      `https://api.polygon.io/v3/reference/tickers/${stock}?apiKey=${api_key}`
    )
    return res.json()
  } catch (error) {
    toast.error('Network error or service unavailable')
    return null
  }
}

async function getStockNews(stock: string) {
  try {
    const res = await fetch(
      `https://api.polygon.io/v2/reference/news?ticker=${stock}&apiKey=${api_key}`
    )
    return res.json()
  } catch (error) {
    toast.error('Network error or service unavailable')
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
  } catch (error) {
    toast.error('Network error or service unavailable')
    return null
  }
}

async function handleAPIResponse(response: Response) {
  if (!response.ok) {
    const errData = await response.json()

    let errorMessage = 'An unexpected error occured'
    if (errData.status) {
      switch (errData.status) {
        case 'NOT_FOUND':
          errorMessage = 'Ticker not found'
          break
        case 'ERROR':
          errorMessage = errData.error || 'An error occured'
          break
        default:
          errorMessage = errData.message || errorMessage
      }
    }
    toast.error(errorMessage)
    return null
  }
  return await response.json()
}

export { getStockPrice, getStockInformation, getStockNews, getMonthPriceHistory }
