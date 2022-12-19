import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const token = ref<string | null>(null);
  const userId = ref<number | null>(null);

  function login(_token: string | null, _userId: number | null) {
    token.value = _token;
    userId.value = _userId;
  }

  function logout() {
    token.value = null;
    userId.value = null;
  }

  return {
    token,
    userId,
    login,
    logout,
  };
});
