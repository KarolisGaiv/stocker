<script setup lang="ts">
import { ref } from 'vue'
import { useUserState } from '@/store/userState'
import { useToast } from 'vue-toastification'

const userStore = useUserState()
const amount = ref<number>(0)
const toast = useToast()

function handleTransaction(type: string): void {
  if (amount.value <= 0) {
    toast.error('Please enter a positive number')
    return
  }

  try {
    if (type === 'deposit') {
      userStore.deposit(amount.value)
      toast.success(`You have deposited $${amount.value} succesfully`)
    } else if (type === 'withdraw') {
      userStore.withdraw(amount.value)
      toast.success(`You have withdrawn $${amount.value} succesfully`)
    }
    amount.value = 0
  } catch (error) {
    const errorMsg = (error as Error).message
    toast.error(errorMsg)
  }
}
</script>

<template>
  <main class="account-balance">
    <h2>Account Balance</h2>
    <p class="balance-info">
      Your current account balance is:
      <span data-test="balance-display"
        ><strong>${{ userStore.balance }}</strong></span
      >
    </p>
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
