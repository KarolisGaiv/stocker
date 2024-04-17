<script setup lang="ts"></script>

<template>
  <main>
    <h2>Login</h2>
    <form>
      <div>
        <label for="username">Username</label>
        <input type="text" id="username" placeholder="username" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="password" />
      </div>
      <button type="submit">Log In</button>
    </form>
    <RouterLink to="/register">Create an account</RouterLink>
  </main>
</template>
