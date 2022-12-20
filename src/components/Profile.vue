<template>
  <div className="row">
    <p><b>Username:</b>&nbsp;{{ account?.username }}</p>
    <p><b>Password:</b>&nbsp;{{ account?.password }}</p>
    <p><b>ID:</b>&nbsp;{{ account?.id }}</p>
    <p><b>Admin:</b>&nbsp;{{ account?.admin ? "true" : "false" }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userSlice";
import * as api from "@/shared/api";
import type { Account } from "@/models/types";

export default defineComponent({
  name: "profile",
  setup() {
    const account = ref<Account>();
    const userStore = useUserStore();
    onMounted(async () => {
      if (userStore.token != null && userStore.userId != null) {
        const acc = await api.getUserAccount({
          id: userStore.userId!,
          token: userStore.token,
        });
        account.value = acc;
      }
    });
    return { account };
  },
});
</script>
