<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend, Colors } from 'chart.js'
Chart.register(PieController, ArcElement, Tooltip, Legend, Colors)

const props = defineProps({
  portfolio: Array
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
              return `Total Value: $${value.toFixed(2)} USD`
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
  <div>
    <canvas ref="portfolioCanvas"></canvas>
  </div>
</template>
