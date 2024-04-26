import type { Stock } from './stock.types'

export interface User {
  balance: number
  portfolio: Stock[]
}
