<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import type { NewsItem, StockHistoricalPriceResponse } from '@/models/stock.types'
import StockChart from './StockChart.vue'
import {
  getStockPrice,
  getStockInformation,
  getStockNews,
  getMonthPriceHistory
} from '@/api/stock_api'
import { useUserState } from '@/store/userState'
import { format } from 'date-fns'

const toast = useToast()
const userState = useUserState()
const searchedTicker = ref('')
const quantity = ref(0)

const stockData = reactive({
  ticker: '',
  name: '',
  price: 0,
  news: [] as NewsItem[],
  quantity: 0,
  historicalPrices: null as StockHistoricalPriceResponse | null,
  homepage: '',
  purchase_price: 0,
  lastUpdated: ''
})

async function searchStock() {
  try {
    stockData.price = (await getStockPrice(searchedTicker.value)).results[0].o
    const infoRes = await getStockInformation(searchedTicker.value)
    stockData.historicalPrices = await getMonthPriceHistory(searchedTicker.value)

    stockData.ticker = infoRes.results.ticker
    stockData.name = infoRes.results.name
    stockData.homepage = infoRes.results.homepage_url
  } catch (error) {
    toast.error((error as Error).message)
  }
}

async function getRelatedStockNews() {
  try {
    const newsRes = await getStockNews(searchedTicker.value)
    stockData.news = newsRes.results
  } catch (error) {
    toast.error((error as Error).message)
  }
}

async function buyStock() {
  if (quantity.value <= 0) {
    toast.error('Please check the stock details and quantity')
    return
  }

  try {
    stockData.purchase_price = stockData.price
    stockData.lastUpdated = format(new Date(), 'yyyy-MM-dd')

    userState.buyStock(quantity.value, stockData)
    toast.success('Purchase successful')
    quantity.value = 0
    searchedTicker.value = ''
  } catch (error) {
    toast.error(`Error: ${(error as Error).message || 'An error occurred during the transaction'}`)
  }
}

async function sellStock() {
  if (quantity.value <= 0) {
    toast.error('Please check the stock details and quantity')
    return
  }

  try {
    userState.sellStock(quantity.value, stockData)
    toast.success('Sale successful')
    quantity.value = 0
    searchedTicker.value = ''
  } catch (error) {
    toast.error(`Error: ${(error as Error).message || 'An error occurred during the transaction'}`)
  }
}

function isInUserPortfolio(ticker: string): boolean {
  return userState.portfolio.some((stock) => stock.ticker === ticker)
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
          v-model="searchedTicker"
          class="stock-name"
          required
        />
        <button type="submit" class="search-btn">Search</button>
      </div>
    </form>

    <div class="stock-info-container" v-if="stockData.name" data-test="stock-info-container">
      <h2>Name: {{ stockData.name }}</h2>
      <div class="stock-labels-wrapper">
        <span class="stock-info-label"
          >Ticker
          <span>{{ stockData.ticker }}</span>
        </span>
        <span class="stock-info-label"
          >Price
          <span>USD {{ stockData.price }}</span>
        </span>
        <a class="stock-info-label stock-homepage-link" :href="stockData.homepage" target="_blank"
          >Homepage</a
        >
      </div>
    </div>

    <div v-if="stockData.historicalPrices" class="price-graph-container">
      <StockChart :historicalData="stockData.historicalPrices.results" />
    </div>

    <div v-if="stockData.historicalPrices" class="trade-action-wrapper">
      <label for="quantity">Enter quantity</label>
      <div class="input-group">
        <input type="number" id="quantity" v-model="quantity" class="stock-quantity" min="0" />
        <button @click="buyStock" class="buy-btn">Buy</button>
        <button @click="sellStock" class="sell-btn">Sell</button>
      </div>

      <div
        v-if="isInUserPortfolio(stockData.ticker)"
        class="portfolio-holdings-wrapper"
        data-test="portfolio-holdings"
      >
        <h3>Holdings In Portfolio</h3>
        <div class="holdings-data">
          <span class="stock-info-label"
            >Quantity
            <span>{{ userState.getStockFromPortfolio(stockData.ticker)?.quantity }}</span>
          </span>
          <span class="stock-info-label"
            >Purchase Price (avg)
            <span>${{ userState.getStockFromPortfolio(stockData.ticker)?.purchase_price }}</span>
          </span>
        </div>
      </div>
    </div>

    <button v-if="stockData.historicalPrices" @click="getRelatedStockNews" class="news-btn">
      Related News
    </button>
    <div class="stock-news" v-if="stockData.news.length > 0" data-test="stock-news-container">
      <ul>
        <li v-for="(newsItem, index) in stockData.news" :key="index" class="news-card">
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

.holdings-data {
  display: flex;
  margin: 1rem 0;
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
