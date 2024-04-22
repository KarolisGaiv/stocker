<script setup lang="ts">
import { ref } from 'vue'
import StockChart from './StockChart.vue'
import {
  getStockPrice,
  getStockInformation,
  getStockNews,
  getMonthPriceHistory
} from '@/api/stock_api'
import { useUserState } from '@/store/userState'
import { format } from 'date-fns'

interface StockDetails {
  name: string
  ticker: string
  description: string
  homepage: string
}

interface StockPriceDetails {
  results: { o: number }[]
}

interface NewsItem {
  title: string
  author: string
  article_url: string
}

interface StockHistoricalPriceResponse {
  results: {
    o: number
  }[]
}

const stockName = ref<string>('')
const stockPrice = ref<number>(0)
const stockDetails = ref<StockDetails | null>(null)
const stockNews = ref<NewsItem[]>([])
const quantity = ref<number>(0)
const userState = useUserState()
const historicalPrices = ref<StockHistoricalPriceResponse | null>(null)

async function searchStock() {
  const price: StockPriceDetails = await getStockPrice(stockName.value.toUpperCase())
  const res = await getStockInformation(stockName.value.toUpperCase())
  historicalPrices.value = await getMonthPriceHistory(stockName.value)

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

async function buyStock() {
  if (!stockDetails.value || quantity.value <= 0) {
    alert('Please check the stock details and quantity')
    return
  }

  try {
    const stockToBuy = {
      name: stockDetails.value.name,
      ticker: stockDetails.value.ticker,
      price: stockPrice.value,
      purchase_price: stockPrice.value,
      quantity: quantity.value,
      lastUpdated: format(new Date(), 'yyyy-MM-dd')
    }

    userState.buyStock(quantity.value, stockToBuy)
    alert('Purchase sucessfull')
  } catch (error) {
    alert(`Error: ${(error as Error).message || 'An error occurred during the transaction'}`)
  }
}

async function sellStock() {
  if (!stockDetails.value || quantity.value <= 0) {
    alert('Please check the stock details and quantity')
    return
  }

  try {
    const stockToSell = {
      name: stockDetails.value.name,
      ticker: stockDetails.value.ticker,
      price: stockPrice.value,
      purchase_price: stockPrice.value,
      quantity: quantity.value,
      lastUpdated: format(new Date(), 'yyyy-MM-dd')
    }

    userState.sellStock(quantity.value, stockToSell)
    alert('Sale successful')
  } catch (error) {
    alert(`Error: ${(error as Error).message || 'An error occurred during the transaction'}`)
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="searchStock" class="search-form">
      <label class="stock-search-label" for="stockName">Search for Stock</label>
      <div class="input-group">
        <input
          type="text"
          id="stockName"
          placeholder="Enter Company Symbol"
          v-model="stockName"
          class="stock-name"
        />
        <button type="submit" class="search-btn">Search</button>
      </div>
    </form>

    <div class="stock-info" v-if="stockDetails">
      <h2>Name: {{ stockDetails.name }}</h2>
      <h3>Ticker: {{ stockDetails.ticker }}</h3>
      <h4>Homepage: {{ stockDetails.homepage }}</h4>
    </div>

    <div class="stock-price" v-if="stockDetails">
      <h4>Price: ${{ stockPrice }}</h4>
    </div>

    <div v-if="historicalPrices" class="price-graph-container">
      <StockChart :historicalData="historicalPrices.results" />
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

    <div class="trade-action-wrapper">
      <h2>Action</h2>
      <label for="quantity">Enter quantity:</label>
      <input type="number" id="quanitity" v-model="quantity" />
      <button @click="buyStock">Buy</button>
      <button @click="sellStock">Sell</button>
    </div>
  </main>
</template>

<style scoped>
.search-form {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;

  & label {
    font-size: 1.5rem;
  }
}

.input-group {
  display: flex;
  align-items: center;
  margin: 1rem 0;

  & input,
  button {
    height: 2.5rem;
    padding: 0.5rem 1rem;
  }
}

.stock-name {
  border: 0;
  border-radius: 0.5rem;
  flex-grow: 1;
  margin-right: 0.5rem;

  &:hover,
  &:focus {
    background: #e8f0fe;
    outline: none;
    border: 1px solid var(--dark-blue-background-color);
  }
}

.search-btn {
  cursor: pointer;
  background: var(--light-blue-background-color);
  border: none;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
  font-size: 1rem;

  &:hover {
    background: var(--dark-blue-background-color);
  }
}
</style>
