<script setup lang="ts">
import { ref } from 'vue'
import { storageService } from '@/utils/storage'
import router from '@/router'

interface RegisterForm {
  username: string
  password: string
  repeatPassw: string
}

const form = ref<RegisterForm>({
  username: '',
  password: '',
  repeatPassw: ''
})

function register() {
  if (form.value.password !== form.value.repeatPassw) {
    alert('Passwords do not match')
    return
  }
  if (storageService.doesUserExists(form.value.username)) {
    alert('Username already exist. Choose a different username')
    return
  }

  storageService.saveUser({ username: form.value.username, password: form.value.password })
  alert('Registration successful')
  router.push('/login')
}
</script>

<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" placeholder="Username" required v-model="form.username" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="password"
          required
          minlength="6"
          v-model="form.password"
        />
      </div>
      <div>
        <label for="repeatPass">Repeat Password:</label>
        <input type="password" id="repeatPass" required v-model="form.repeatPassw" />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>
