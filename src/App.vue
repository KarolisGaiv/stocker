<script setup lang="ts">
import { RouterView } from 'vue-router'
import { storageService } from './utils/storage'
import { watchEffect, ref } from 'vue'

const balance = ref(0)

function fetchBalance() {
  const user = storageService.getUser()
  balance.value = user.balance
}

watchEffect(() => {
  fetchBalance()
})
</script>

<template>
  <header>
    <h1>Stocky App</h1>
    <button>Balance: ${{ balance }}</button>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  border-bottom: 1px solid;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
