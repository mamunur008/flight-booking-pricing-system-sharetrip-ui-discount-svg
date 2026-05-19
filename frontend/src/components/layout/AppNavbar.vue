<template>
  <header class="topbar">
    <button class="brand brand-button" type="button" @click="router.push('/')">
      <span class="brand-icon">✈</span>
      <span>ShareTrip</span>
    </button>

    <nav class="nav">
      <RouterLink to="/">Flight</RouterLink>
      <RouterLink to="/config">Pricing</RouterLink>
      <RouterLink to="/svg">SVG</RouterLink>
    </nav>

    <RouterLink v-if="!isLoggedIn" to="/login" class="loginBtn">Login</RouterLink>
    <button v-else class="loginBtn" type="button" @click="handleLogout">Logout</button>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = computed(() => Boolean(localStorage.getItem('token')))

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
