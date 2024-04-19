<script setup lang="ts">
import { useUserState } from '@/store/userState'
import { calculateTotalInvested } from '@/utils/portfolio'
import { computed } from 'vue'

const { balance, portfolio } = useUserState()

const totalInvested = computed(() => {
  return calculateTotalInvested(portfolio)
})
</script>

<template>
  <main>
    <h1>This is A "Home View"</h1>

    <div>
      <h2>Your portfolio</h2>
      <h3>Portfolio size: ${{ totalInvested }}</h3>
    </div>
  </main>
</template>
