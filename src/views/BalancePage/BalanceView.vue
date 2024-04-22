<script setup lang="ts">
import { ref } from 'vue'
import { useUserState } from '@/store/userState'

const userStore = useUserState()
const amount = ref<number>(0)

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
  <main class="account-balance">
    <h2>Account Balance</h2>
    <p class="balance-info">Your current account balance is: ${{ userStore.balance }}</p>
    <div class="transaction-form">
      <input
        type="number"
        v-model.number="amount"
        class="amount-input"
        placeholder="Enter amount"
      />
      <div class="buttons">
        <button @click="handleTransaction('deposit')" class="deposit-btn">Deposit</button>
        <button @click="handleTransaction('withdraw')" class="withdraw-btn">Withdraw</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.account-balance {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.balance-info {
  margin: 1rem 0;
  font-size: 1.2rem;
}

.transaction-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.amount-input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.deposit-btn,
.withdraw-btn {
  padding: 0.8rem;
  cursor: pointer;
  border: none;
  border-radius: 0.3rem;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  min-width: 140px;
}

.deposit-btn {
  background-color: var(--lime-background-color);
}

.deposit-btn:hover {
  background-color: #b9c429;
}

.withdraw-btn {
  background-color: var(--red-background-color);
}

.withdraw-btn:hover {
  background-color: #e65c5c;
}
</style>
