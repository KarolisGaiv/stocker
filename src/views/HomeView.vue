<script setup lang="ts">
import { getStockData } from '@/api/stock_api'
import { ref } from 'vue'

const stockInfo = ref(null)

getStockData('NVDA')
  .then((data) => {
    if (data && data['Global Quote']) {
      stockInfo.value = data
      console.log(stockInfo.value)
    } else {
      console.error('Data is not in the expected format:', data)
    }
  })
  .catch((error) => {
    console.error('Failed to fetch data', error)
  })
</script>

<template>
  <main>
    <h1>This is a test</h1>
    <h2 v-if="stockInfo && stockInfo['Global Quote']">
      {{ stockInfo['Global Quote']['01. symbol'] }}
    </h2>
    <p v-else>Loading stock information or no data available...</p>
  </main>
</template>
