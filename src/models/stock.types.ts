export interface Stock {
  ticker: string
  name: string
  price: number
  purchase_price: number
  lastUpdated: string
  quantity: number
}

export interface NewsItem {
  title: string
  author: string
  article_url: string
}

export interface StockHistoricalPriceResponse {
  results: {
    o: number
  }[]
}
