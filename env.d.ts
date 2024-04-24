// Extend the ImportMeta interface
interface ImportMeta {
  readonly env: {
    readonly BASE_URL: string
    readonly VITE_STOCK_API_KEY: string
  }
}
