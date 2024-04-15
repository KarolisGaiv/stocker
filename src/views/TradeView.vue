<script setup lang="ts">
import { ref } from 'vue'
import { getStockPrice, getStockInformation } from '@/api/stock_api'

const stockName = ref('')
const stockDetails = ref()

async function searchStock() {
  const res = await getStockInformation(stockName.value.toUpperCase())
  stockDetails.value = {
    name: res.results.name,
    ticker: res.results.ticker,
    description: res.results.description,
    homepage: res.results.homepage_url
  }
}
</script>

<template>
  <header><h1>Place to Trade</h1></header>
  <main>
    <form @submit.prevent="searchStock">
      <label for="stockName">Search for Stock</label>
      <input type="text" id="stockName" placeholder="Enter Company Symbol" v-model="stockName" />
      <button type="submit">Search</button>
    </form>

    <div class="stock-info" v-if="stockDetails">
      <h2>Name: {{ stockDetails.name }}</h2>
      <h3>Ticker: {{ stockDetails.ticker }}</h3>
      <h4>Homepage: {{ stockDetails.homepage }}</h4>
    </div>
  </main>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>
