<script setup lang="ts">
import { ref } from 'vue'
import { getStockPrice, getStockInformation, getStockNews } from '@/api/stock_api'

interface StockDetails {
  name: string
  ticker: string
  description: string
  homepage: string
}

interface StockPriceDetails {
  results: { o: number }[]
}

const stockName = ref<string>('')
const stockPrice = ref<number>(0)
const stockDetails = ref<StockDetails | null>(null)
const stockNews = ref([])

async function searchStock() {
  const price: StockPriceDetails = await getStockPrice(stockName.value.toUpperCase())
  const res = await getStockInformation(stockName.value.toUpperCase())

  stockDetails.value = {
    name: res.results.name,
    ticker: res.results.ticker,
    description: res.results.description,
    homepage: res.results.homepage_url
  }

  stockPrice.value = price.results[0].o

  stockName.value = ''
}

async function getRelatedStockNews() {
  if (!stockDetails.value) {
    console.error('No stock details available')
    return
  }
  const data = await getStockNews(stockDetails.value.ticker.toUpperCase())
  stockNews.value = data.results
  console.log(stockNews.value)
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

    <div class="stock-price" v-if="stockDetails">
      <h4>Price: ${{ stockPrice }}</h4>
    </div>

    <button @click="getRelatedStockNews">Related News</button>
    <div class="stock-news" v-if="stockNews.length > 0">
      <ul>
        <li v-for="(newsItem, index) in stockNews" :key="index">
          <h5>{{ newsItem.title }}</h5>
          <p>{{ newsItem.author }}</p>
          <a :href="newsItem.article_url" target="_blank">Read More</a>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>
