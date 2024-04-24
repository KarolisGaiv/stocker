<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import logo from './assets/stocky-icon.png'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const buttonLabel = computed(() => (route.path === '/balance' ? 'Home' : 'Balance'))
const buttonAction = computed(() => (route.path === '/balance' ? '/' : '/balance'))
</script>

<template>
  <header>
    <button @click="$router.push('/')" class="app-btn">
      <img :src="logo" alt="Stocky App logo" />
    </button>
    <h1>Stocky App</h1>
    <button @click="router.push(buttonAction)" class="profile-btn">{{ buttonLabel }}</button>
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
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  box-shadow: none;
}

.profile-btn {
  border-radius: 0.5rem;
  border: none;
  background: var(--light-blue-background-color);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: var(--dark-blue-background-color);
  }
}
</style>
