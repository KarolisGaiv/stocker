<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { format } from 'date-fns'

const props = defineProps({
  historicalData: Array
})

const stockChartCanvas = ref(null)
let stockChart = null

const drawChart = (historicalData) => {
  const ctx = stockChartCanvas.value.getContext('2d')
  if (stockChart) {
    stockChart.destroy()
  }
  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historicalData.map((data) => format(data.t, 'MM-dd')),
      datasets: [
        {
          label: 'Stock Price USD',
          data: historicalData.map((data) => data.o)
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (dates) {
              return dates.map((date) => format(historicalData[date.dataIndex].t, 'yyyy-MM-dd'))
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  drawChart(props.historicalData)
})

watch(
  () => props.historicalData,
  (newData) => {
    drawChart(newData)
  },
  { deep: true }
)
</script>

<template>
  <canvas ref="stockChartCanvas"></canvas>
</template>

<style scoped>
canvas {
  max-width: 500px;
}
</style>
