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

/* 
https://www.google.com/search?q=do+you+need+unit+test+for+fetch%3F&oq=do+you+need+unit+test+for+fetch%3F&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIKCAIQIRigARiLAzIKCAMQIRigARiLA9IBCDQ5MjhqMWo3qAIAsAIA&sourceid=chrome&ie=UTF-8


https://medium.com/fernandodof/how-to-mock-fetch-calls-with-jest-a666ae1e7752

https://medium.com/@razita.afrina/testing-fetch-api-calls-in-react-7f047ac2d220

*/
