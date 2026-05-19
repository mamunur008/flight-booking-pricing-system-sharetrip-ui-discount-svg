<template>
  <div class="auth">
    <div class="auth-card">
      <h1>Flight Pricing System</h1>
      <p class="muted">Login or register for the assessment demo.</p>

      <input v-model="name" class="field" placeholder="Name" />
      <input v-model="email" class="field" placeholder="Email" />
      <input
        v-model="password"
        class="field"
        type="password"
        placeholder="Password"
      />

      <div class="auth-actions">
        <button class="primary" type="button" @click="login">Login</button>
        <button class="primary secondary" type="button" @click="register">
          Register
        </button>
      </div>

      <p v-if="msg" class="error-text">{{ msg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/api";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const { setSession } = useAuthStore();

const name = ref("Interview Admin");
const email = ref("admin@example.com");
const password = ref("Password123!");
const msg = ref("");

async function login() {
  try {
    const { data } = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    setSession(data);
    router.push("/");
  } catch (error) {
    msg.value = error.response?.data?.message || error.message;
  }
}

async function register() {
  try {
    await api.post("/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    await login();
  } catch (error) {
    msg.value = error.response?.data?.message || error.message;
  }
}
</script>
