<script setup lang="ts">
import { getStockData } from '@/api/stock_api'
import { ref } from 'vue'

interface StockData {
  ticker: string
  results: Result[]
  status: string
}

interface Result {
  o: number
}

const stockInfo = ref<StockData | null>(null)

getStockData('EQNR').then((data: StockData) => {
  stockInfo.value = data
  console.log(stockInfo.value)
})
</script>

<template>
  <main>
    <h1>This is a test</h1>
    <h2 v-if="stockInfo && stockInfo.ticker">
      {{ stockInfo.ticker }}
      <h3>Price: {{ stockInfo.results[0].o }}</h3>
    </h2>
    <p v-else>Loading stock information or no data available...</p>
  </main>
</template>
