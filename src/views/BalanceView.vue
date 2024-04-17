<script setup lang="ts">
import { ref } from 'vue'
import { storageService } from '@/utils/storage'
import { useUserState } from '@/store/userState'

const { userState, updateUserState } = useUserState()
const amount = ref(0)

function handleTransaction(type: string) {
  if (amount.value <= 0) {
    alert('Please enter a positive amount')
    return
  }

  let newBalance = userState.balance

  if (type === 'deposit') {
    newBalance += amount.value
  } else if (type === 'withdraw') {
    if (amount.value > userState.balance) {
      alert('Insufficient balance')
      return
    }
    newBalance -= amount.value
  }

  storageService.updateUser(userState.username, { balance: newBalance })
  updateUserState() // update global state
  amount.value = 0
}
</script>

<template>
  <div>
    <h1>Account Balance</h1>
    <p>Your current account balance is: ${{ userState.balance }}</p>
    <input type="number" placeholder="Enter amount" v-model.number="amount" />
    <button @click="handleTransaction('deposit')">Deposit</button>
    <button @click="handleTransaction('withdraw')">Withdraw</button>
  </div>
</template>
