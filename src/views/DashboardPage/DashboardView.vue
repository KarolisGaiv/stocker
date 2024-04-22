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
    <div class="container">
      <h2>Your Portfolio Details</h2>
      <div class="portfolio-details">
        <div class="portfolio-value-container">
          <p>Current Value</p>
          <p>${{ totalCurrentPortfolioValue }}</p>
        </div>
        <div
          class="portfolio-return-container"
          :class="{
            'positive-return': portfolioReturn > 0,
            'negative-return': portfolioReturn < 0,
            'neutral-return': portfolioReturn === 0
          }"
        >
          <p>Total Return</p>
          <p>{{ portfolioReturn }}%</p>
        </div>
      </div>
    </div>
    <div>
      <PortfolioChart :portfolio="portfolio" :portfolioValue="totalCurrentPortfolioValue" />
    </div>
    <button @click="$router.push(`/trade`)">Go To Trade</button>
  </main>
</template>

<style scoped>
h2 {
  text-align: center;
}

.container {
  margin: 1rem 0;
}

.portfolio-details {
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-evenly;
  margin: 1rem 0;
}

.portfolio-value-container,
.portfolio-return-container {
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.2rem 1rem;
  min-width: 150px;
}

.portfolio-value-container,
.neutral-return {
  background: var(--yellow-background-color);
}

.positive-return {
  background: var(--lime-background-color);
}

.negative-return {
  background: var(--red-background-color);
}
</style>
