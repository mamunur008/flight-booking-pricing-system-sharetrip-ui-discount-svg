<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Recover Password</h1>
      <p>Enter your email to receive recovery instructions</p>

      <form @submit.prevent="recover">
        <label>Email</label>
        <input
          v-model="email"
          class="auth-input"
          placeholder="example@email.com"
        />

        <button class="auth-btn">Send Recovery Link</button>
      </form>

      <p class="auth-link">
        Remembered your password?
        <RouterLink to="/login">Sign In</RouterLink>
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { api } from "../services/api";

const email = ref("");

async function recover() {
  await api.post("/auth/forgot-password", {
    email: email.value,
  });

  alert("Recovery request submitted");
}
</script>
