<script setup lang="ts">
import { ref } from 'vue'
import { useUserState } from '@/store/userState'

const userStore = useUserState()
const amount = ref(0)

function handleTransaction(type: string): void {
  if (amount.value < 0) {
    alert('Please enter a positive number')
    return
  }

  try {
    if (type === 'deposit') {
      userStore.deposit(amount.value)
    } else if (type === 'withdraw') {
      userStore.withdraw(amount.value)
    }
    amount.value = 0
  } catch (error) {
    const errorMsg = (error as Error).message
    alert(errorMsg)
  }
}
</script>

<template>
  <div>
    <h1>Account Balance</h1>
    <p>Your current account balance is: ${{ userStore.balance }}</p>
    <input type="number" placeholder="Enter amount" v-model.number="amount" />
    <button @click="handleTransaction('deposit')">Deposit</button>
    <button @click="handleTransaction('withdraw')">Withdraw</button>
  </div>
</template>
