const api_key = import.meta.env.STOCK_API_KEY

async function getStockData(stock: string): Promise<any> {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${api_key}`
    )
    if (!res.ok) {
      throw new Error(`Unable to fetch stock information. status: ${res.status}`)
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching data: ', error)
    return null
  }
}

export { getStockData }
