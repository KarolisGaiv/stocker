<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(PieController, ArcElement, Tooltip, Legend)

const props = defineProps({
  portfolio: Array
})

const portfolioCanvas = ref(null)
let myChart = null

const drawChart = () => {
  const labels = props.portfolio.map((stock) => stock.name)
  const data = props.portfolio.map((stock) => stock.price * stock.quantity)

  const backgroundColors = props.portfolio.map(() => `hsl(${Math.random() * 360}, 100%, 75%)`)

  if (myChart) {
    myChart.destroy() // Destroy the previous chart instance if exists
  }

  myChart = new Chart(portfolioCanvas.value.getContext('2d'), {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data,
          backgroundColor: backgroundColors,
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
          enabled: true
        }
      }
    }
  })
}

onMounted(drawChart)
watch(() => props.portfolio, drawChart, { deep: true })
</script>

<template>
  <div>
    <canvas ref="portfolioCanvas"></canvas>
  </div>
</template>
