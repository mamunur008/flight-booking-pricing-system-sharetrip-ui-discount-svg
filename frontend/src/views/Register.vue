<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Let’s Get Started</h1>
      <p>Create an account to continue</p>

      <form @submit.prevent="register">
        <label>Name</label>
        <input v-model="form.name" class="auth-input" placeholder="Your name" />

        <label>Email</label>
        <input
          v-model="form.email"
          class="auth-input"
          placeholder="example@email.com"
        />

        <label>Password</label>
        <input
          v-model="form.password"
          type="password"
          class="auth-input"
          placeholder="Your password"
        />

        <button class="auth-btn">Sign Up</button>
      </form>

      <p class="auth-link">
        Already have an account?
        <RouterLink to="/login">Sign In</RouterLink>
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/api";

const router = useRouter();

const form = ref({
  name: "",
  email: "",
  password: "",
});

async function register() {
  await api.post("/auth/register", form.value);
  router.push("/login");
}
</script>
