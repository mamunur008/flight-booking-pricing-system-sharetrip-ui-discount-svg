<template>
  <header class="topbar">
    <button class="brand brand-button" type="button" @click="router.push('/')">
      ✈ ShareTrip
    </button>

    <nav class="nav">
      <RouterLink to="/">Flight</RouterLink>

      <RouterLink to="/config">Pricing</RouterLink>
      <RouterLink to="/svg">SVG</RouterLink>
    </nav>

    <RouterLink v-if="!isLoggedIn" to="/login" class="loginBtn"
      >Login</RouterLink
    >
    <button v-else class="loginBtn" type="button" @click="logout">
      Logout
    </button>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const { isLoggedIn, logout } = useAuthStore();
</script>
