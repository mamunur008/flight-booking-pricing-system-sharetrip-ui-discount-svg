import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const token = ref(localStorage.getItem("token") || "");
const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

export function useAuthStore() {
  const router = useRouter();
  const isLoggedIn = computed(() => Boolean(token.value));

  function setSession(payload) {
    token.value = payload?.token || "";
    user.value = payload?.user || null;

    if (token.value) localStorage.setItem("token", token.value);
    if (user.value) localStorage.setItem("user", JSON.stringify(user.value));
  }

  function logout() {
    token.value = "";
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return { token, user, isLoggedIn, setSession, logout };
}
