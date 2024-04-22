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
    <button @click="$router.push('/')" class="app-btn">Stocky App</button>
    <button @click="$router.push('/balance')" class="balance-btn">Balance: ${{ balance }}</button>
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
  padding: 0.5rem 0;
}

.app-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  box-shadow: none;
  text-wrap: nowrap;
}

.balance-btn {
  border-radius: 0.5rem;
  border: none;
  background: var(--light-blue-background-color);
  padding: 0 1rem;
  cursor: pointer;

  &:hover {
    background: var(--dark-blue-background-color);
  }
}
</style>
