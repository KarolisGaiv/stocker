<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>Page Not Found</p>
    <button @click="$router.push('/')">Go Home</button>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

h1 {
  font-size: 4rem;
  color: #2c3e50;
}

p {
  font-size: 1.5rem;
  color: #7f8c8d;
}

button {
  padding: 1rem 2rem;
  font-size: 1rem;
  background-color: var(--light-blue-background-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 2rem;
  transition:
    background-color 0.3s,
    transform 0.2s;
}

button:hover {
  background-color: var(--dark-blue-background-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:focus {
  outline: none; /* Removes the default focus outline */
}
</style>
