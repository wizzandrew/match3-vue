<template>
  <div class="header">
    <nav class="navbar navbar-expand-md bg-light">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#leftNav"
          aria-controls="collapsibleNav"
          aria-expanded="false"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link active" aria-current="page"
                >Play</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink to="/scores" class="nav-link">Scores</RouterLink>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink to="/myprofile" class="nav-link"
                >My Profile</RouterLink
              >
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-secondary">Log in</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "header",
  setup() {},
});
</script>

<style></style>
