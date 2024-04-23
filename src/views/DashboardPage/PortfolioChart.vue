<script setup>
import { ref, onMounted, watch } from 'vue'
import { calculateStockPercentageOfPortfolio } from '@/utils/portfolio'
import { Chart, PieController, ArcElement, Tooltip, Legend, Colors } from 'chart.js'
Chart.register(PieController, ArcElement, Tooltip, Legend, Colors)

const props = defineProps({
  portfolio: Array,
  portfolioValue: Number
})

const portfolioCanvas = ref(null)
let myChart = null

const drawChart = () => {
  const labels = props.portfolio.map((stock) => stock.name)
  const data = props.portfolio.map((stock) => stock.price * stock.quantity)

  if (myChart) {
    myChart.destroy()
  }

  myChart = new Chart(portfolioCanvas.value.getContext('2d'), {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          hoverOffset: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem) {
              let value = tooltipItem.raw
              let percentage = calculateStockPercentageOfPortfolio(value, props.portfolioValue)
              return `Percentage in Portfolio: ${percentage}%`
            }
          }
        }
      }
    }
  })
}

onMounted(drawChart)
watch(() => props.portfolio, drawChart, { deep: true })
</script>

<template>
  <div class="chart-container">
    <canvas ref="portfolioCanvas"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  margin: 2rem 0;
  max-width: 500px;
  grid-area: chart;

  @media (min-width: var(--breakpoint-tablet)) {
    margin: 1rem;
  }
}
</style>
