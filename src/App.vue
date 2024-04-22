<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <button @click="$router.push('/')" class="app-btn">Stocky App</button>
    <button @click="$router.push('/balance')" class="profile-btn">Profile</button>
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
  cursor: pointer;
  font-size: 1.5rem;
  box-shadow: none;
  text-wrap: no;
}

.profile-btn {
  border-radius: 0.5rem;
  border: none;
  background: var(--light-blue-background-color);
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: var(--dark-blue-background-color);
  }
}
</style>
