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
    <PortfolioChart :portfolio="portfolio" :portfolioValue="totalCurrentPortfolioValue" />
    <button @click="$router.push(`/trade`)" class="trade-btn">Trade</button>
  </main>
</template>

<style scoped>
main {
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

.trade-btn {
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  background: #dc84f3;
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition:
    box-shadow 0.2s,
    padding 0.2s;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.3);
  }
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
