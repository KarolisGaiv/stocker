import type { Stock } from '@/models/stock.types'

/**
 * Calculates the total invested amount for a single stock or an array of stocks.
 *
 * @param {Stock | Stock[]} input - A single stock or an array of stocks.
 * @returns {number} The total amount invested based on purchase price and quantity.
 */
export function calculateTotalInvested(input: Stock | Stock[]): number {
  // check if input is an array. If not, wrap input in array
  const stocks = Array.isArray(input) ? input : [input]
  const total = stocks.reduce((total, stock) => total + stock.purchase_price * stock.quantity, 0)
  return parseFloat(total.toFixed(2))
}

/**
 * Calculates the current value of a single stock or an array of stocks based on the current price and quantity.
 *
 * @param {Stock | Stock[]} input - A single stock or an array of stocks.
 * @returns {number} The current value of the stocks.
 */
export function calculateCurrentValue(input: Stock | Stock[]): number {
  const stocks = Array.isArray(input) ? input : [input]
  const total = stocks.reduce((total, stock) => total + stock.price * stock.quantity, 0)
  return parseFloat(total.toFixed(2))
}

export function calculatePortfolioReturn(currentValue: number, investedValue: number): number {
  if (investedValue === 0) {
    return 0
  }
  const result = ((currentValue - investedValue) / investedValue) * 100
  return parseFloat(result.toFixed(2))
}

export function calculateStockPercentageOfPortfolio(
  sharesValue: number,
  portfolioValue: number
): number {
  return parseFloat(((sharesValue / portfolioValue) * 100).toFixed(2))
}
