<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="app">
    <nav>
      <RouterLink to="/">Play</RouterLink>
      <RouterLink to="/scores">Scores</RouterLink>
      <RouterLink to="/myprofile">My Profile</RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<style></style>
