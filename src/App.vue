<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<style></style>
