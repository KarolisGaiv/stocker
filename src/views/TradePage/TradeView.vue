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

    <div class="stock-info-container" v-if="stockDetails">
      <h2>Name: {{ stockDetails.name }}</h2>
      <div class="stock-labels-wrapper">
        <span class="stock-info-label"
          >Ticker
          <span>{{ stockDetails.ticker }}</span>
        </span>
        <span class="stock-info-label"
          >Price
          <span>USD {{ stockPrice }}</span>
        </span>
        <a
          class="stock-info-label stock-homepage-link"
          :href="stockDetails.homepage"
          target="_blank"
          >Homepage</a
        >
      </div>
    </div>

    <div v-if="historicalPrices" class="price-graph-container">
      <StockChart :historicalData="historicalPrices.results" />
    </div>

    <div v-if="historicalPrices" class="trade-action-wrapper">
      <label for="quantity">Enter quantity</label>
      <div class="input-group">
        <input type="number" id="quanitity" v-model="quantity" class="stock-quantity" />
        <button @click="buyStock" class="buy-btn">Buy</button>
        <button @click="sellStock" class="sell-btn">Sell</button>
      </div>
    </div>

    <button v-if="historicalPrices" @click="getRelatedStockNews">Related News</button>
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

  & .buy-btn:hover {
    background: var(--lime-background-color);
  }

  & .sell-btn:hover {
    background: var(--red-background-color);
  }
}

.stock-name,
.stock-quantity {
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

.search-btn,
.buy-btn,
.sell-btn {
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

.stock-labels-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
}

.stock-info-label {
  background: var(--yellow-background-color);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  padding: 0.2rem;
  text-align: center;
  justify-content: center;
  flex: 1;
  margin: 0 0.2rem;
  font-weight: bold;
}

.stock-homepage-link {
  transition: background-color 0.3s ease;
  padding: 0.2rem 0.4rem;

  &:hover {
    background-color: #d9ba4b;
  }
}

.price-graph-container {
  margin: 1rem 0;
}

.trade-action-wrapper {
  display: flex;
  flex-direction: column;

  & label {
    font-size: 1.5rem;
  }
}

.buy-btn,
.sell-btn {
  width: 20%;
  margin: 0 0.2rem;
}
</style>
