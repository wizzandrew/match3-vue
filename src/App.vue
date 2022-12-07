<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="app">
    <div class="container">
      <Header />
    </div>

    <RouterView />
  </div>
</template>

<style></style>
