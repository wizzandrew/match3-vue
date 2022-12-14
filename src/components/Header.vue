<template>
  <div class="modalContainer">
    <div class="modal" id="createAccountModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Account</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form action="" @submit.prevent="createAccount">
              <div class="form-group mb-3">
                <label class="form-label" for="__username">Username</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="createUsername"
                  name="newUsername"
                  id="__username"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label" for="__password">Password</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="createPassword"
                  name="newPassword"
                  id="__password"
                />
              </div>
              <button type="submit" class="btn btn-primary d-flex my-0 mx-auto">
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

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
            <li class="nav-item">
              <button
                class="btn btn-light"
                data-bs-toggle="modal"
                data-bs-target="#createAccountModal"
              >
                Create Account
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { RouterLink } from "vue-router";
import * as api from "@/shared/api";

export default defineComponent({
  name: "header",
  setup() {
    //data
    const createUsername = ref("");
    const createPassword = ref("");

    //methods
    const createAccount = () => {
      // console.log(
      //   "user: " + createUsername.value + "\npassword: " + createPassword.value
      // );
      api.createAccount({
        username: createUsername.value,
        password: createPassword.value,
      });
    };

    return { createUsername, createPassword, createAccount };
  },
});
</script>

<style></style>
