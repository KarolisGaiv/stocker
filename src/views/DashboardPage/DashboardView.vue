<script setup lang="ts">
import { useUserState } from '@/store/userState'
import {
  calculateTotalInvested,
  calculateCurrentValue,
  calculatePortfolioReturn
} from '@/utils/portfolio'
import { computed, onMounted } from 'vue'
import PortfolioChart from './PortfolioChart.vue'

const { portfolio, updatePortfolioPrices } = useUserState()

const totalInvested = computed(() => {
  return calculateTotalInvested(portfolio)
})

const totalCurrentPortfolioValue = computed(() => {
  return calculateCurrentValue(portfolio)
})

const portfolioReturn = computed(() => {
  return calculatePortfolioReturn(totalCurrentPortfolioValue.value, totalInvested.value)
})

onMounted(async () => {
  await updatePortfolioPrices()
})
</script>

<template>
  <main>
    <div>
      <h2>Your Portfolio Details</h2>
      <h3>Portfolio size: ${{ totalInvested }}</h3>
      <h3>Current Portfolio value: ${{ totalCurrentPortfolioValue }}</h3>
      <h4>Portfolio Return: {{ portfolioReturn }}%</h4>
    </div>
    <div>
      <PortfolioChart :portfolio="portfolio" :portfolioValue="totalCurrentPortfolioValue" />
    </div>
    <button @click="$router.push(`/trade`)">Go To Trade</button>
  </main>
</template>
