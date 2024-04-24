<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
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

const toast = useToast()
const stockName = ref<string>('')
const stockPrice = ref<number>(0)
const stockDetails = ref<StockDetails | null>(null)
const stockNews = ref<NewsItem[]>([])
const quantity = ref<number>(0)
const userState = useUserState()
const historicalPrices = ref<StockHistoricalPriceResponse | null>(null)

async function searchStock() {
  try {
    const priceRes = await getStockPrice(stockName.value.toUpperCase())
    if (!priceRes.results) {
      toast.error('Stock not found')
      return
    }
    const infoRes = await getStockInformation(stockName.value.toUpperCase())
    if (!infoRes.results) {
      toast.error('Stock not found')
      return
    }
    const histPriceRes = await getMonthPriceHistory(stockName.value.toUpperCase())

    stockDetails.value = {
      name: infoRes.results.name,
      ticker: infoRes.results.ticker,
      description: infoRes.results.description,
      homepage: infoRes.results.homepage_url
    }

    stockPrice.value = priceRes.results[0].o
    historicalPrices.value = histPriceRes
  } catch (error) {
    toast.error((error as Error).message || 'An error occurred during the search.')
  } finally {
    stockName.value = ''
  }
}

async function getRelatedStockNews() {
  if (!stockDetails.value) {
    toast.error('No stock details available')
    return
  }
  const data = await getStockNews(stockDetails.value.ticker.toUpperCase())
  stockNews.value = data.results
}

async function buyStock() {
  if (!stockDetails.value || quantity.value <= 0) {
    toast.error('Please check the stock details and quantity')
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
    toast.success('Purchase successful')
    quantity.value = 0
  } catch (error) {
    toast.error(`Error: ${(error as Error).message || 'An error occurred during the transaction'}`)
  }
}

async function sellStock() {
  if (!stockDetails.value || quantity.value <= 0) {
    toast.error('Please check the stock details and quantity')
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
    toast.success('Sale successful')
    quantity.value = 0
  } catch (error) {
    toast.error(`Error: ${(error as Error).message || 'An error occurred during the transaction'}`)
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="searchStock" class="search-form">
      <div class="header">
        <label class="stock-search-label" for="stockName">Search for Stock</label>
        <div class="balance-holder">
          <p>Balance: ${{ userState.balance }}</p>
        </div>
      </div>

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

    <div class="stock-info-container" v-if="stockDetails" data-test="stock-info-container">
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

    <button v-if="historicalPrices" @click="getRelatedStockNews" class="news-btn">
      Related News
    </button>
    <div class="stock-news" v-if="stockNews.length > 0" data-test="stock-news-container">
      <ul>
        <li v-for="(newsItem, index) in stockNews" :key="index" class="news-card">
          <a :href="newsItem.article_url" target="_blank">{{ newsItem.title }}</a>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
main {
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'search info'
      'chart actions'
      'chart news'
      'stock-news stock-news';

    gap: 20px;
  }
}

.search-form {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  grid-area: search;

  & label {
    font-size: 1.5rem;
  }

  & .header {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
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

.stock-info-container {
  grid-area: info;

  @media (min-width: 1024px) {
    margin: 1rem 0;
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
.sell-btn,
.news-btn {
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

.stock-info-label,
.news-card {
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

.stock-homepage-link,
.news-card {
  transition: background-color 0.3s ease;
  padding: 0.2rem 0.4rem;

  &:hover {
    background-color: #d9ba4b;
  }
}

.price-graph-container {
  grid-area: chart;
  margin: 1rem 0;
}

.trade-action-wrapper {
  display: flex;
  flex-direction: column;
  grid-area: actions;

  & label {
    font-size: 1.5rem;
  }

  @media (min-width: 1024px) {
    margin: 1rem 0;
  }
}

.balance-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--yellow-background-color);
  border-radius: 0.5rem;
  text-align: center;
  padding: 0.5rem 1rem;

  & p {
    font-weight: bold;
  }
}

.buy-btn,
.sell-btn {
  width: 20%;
  margin: 0 0.2rem;
}

.news-btn {
  grid-area: news;
  padding: 1rem;
  width: 100%;

  @media (min-width: 1024px) {
    height: fit-content;
  }
}

.stock-news {
  grid-area: stock-news;
}

ul {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.news-card {
  color: black;
  margin: 0.5rem 0;
  border: 1px solid;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  padding: 0.5rem;

  & a {
    color: black;
  }
}
</style>
