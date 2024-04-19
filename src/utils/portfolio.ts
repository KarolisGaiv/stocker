interface Stock {
  ticker: string
  name: string
  price: number
  purchase_price: number
  lastUpdated: string
  quantity: number
}

export function calculateTotalInvested(portfolio: Stock[]): number {
  return portfolio.reduce((total, stock) => total + stock.purchase_price * stock.quantity, 0)
}

export function calculateCurrentValue(portfolio: Stock[]): number {
  return portfolio.reduce((total, stock) => total + stock.price * stock.quantity, 0)
}

export function calculatePortfolioReturn(currentValue: number, investedValue: number): number {
  return ((currentValue - investedValue) / investedValue) * 100
}
