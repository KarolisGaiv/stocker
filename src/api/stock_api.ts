const api_key = import.meta.env.VITE_STOCK_API_KEY

async function getStockData(stock: string) {
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

export { getStockData }
