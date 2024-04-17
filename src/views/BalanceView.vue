<script setup lang="ts">
import { computed, ref } from 'vue'
import { storageService } from '@/utils/storage'
import { useUserState } from '@/store/userState'

const { userState, updateUserState } = useUserState()
const amount = ref(0)
// const username = localStorage.getItem('loggedInUser')!

// const balance = computed(() => {
//   const userDetails = storageService.getUser(username)
//   return userDetails ? userDetails.balance : 0
// })

// function deposit() {
//   if (amount.value > 0) {
//     const newBalance = balance.value + amount.value
//     storageService.updateUser(username, { balance: newBalance })
//     amount.value = 0
//   }
// }

// function withdraw() {
//   if (amount.value > 0 && amount.value <= balance.value) {
//     const newBalance = balance.value - amount.value
//     storageService.updateUser(username, { balance: newBalance })
//     amount.value = 0
//   } else {
//     alert('Insufficient balance')
//   }
// }

function deposit() {
  if (amount.value > 0) {
    const newBalance = userState.balance + amount.value
    storageService.updateUser(userState.username, { balance: newBalance })
    updateUserState() // update global state
    amount.value = 0
  }
}

function withdraw() {
  if (amount.value <= 0 || amount.value > userState.balance) {
    alert('Insufficient balance')
  } else {
    const newBalance = userState.balance - amount.value
    storageService.updateUser(userState.username, { balance: newBalance })
    updateUserState()
    amount.value = 0
  }
}
</script>

<template>
  <div>
    <h1>Account Balance</h1>
    <p>Your current account balance is: ${{ userState.balance }}</p>
    <input type="number" placeholder="Enter amount" v-model.number="amount" />
    <button @click="deposit">Deposit</button>
    <button @click="withdraw">Withdraw</button>
  </div>
</template>
