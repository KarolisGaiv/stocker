<script setup lang="ts">
import { ref } from 'vue'
import { storageService } from '@/utils/storage'
import { useRouter } from 'vue-router'

interface LoginForm {
  username: string
  password: string
}

const loginForm = ref<LoginForm>({
  username: '',
  password: ''
})

const router = useRouter()

function login() {
  if (storageService.validateUser(loginForm.value.username, loginForm.value.password)) {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('loggedInUser', loginForm.value.username)
    router.push('/')
  } else {
    alert('Invalid credentials')
  }
}
</script>

<template>
  <main>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="username"
          required
          v-model="loginForm.username"
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="password"
          required
          v-model="loginForm.password"
        />
      </div>
      <button type="submit">Log In</button>
    </form>
    <RouterLink to="/register">Create an account</RouterLink>
  </main>
</template>
