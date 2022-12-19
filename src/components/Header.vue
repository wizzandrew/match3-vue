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
                  type="password"
                  v-model="createPassword"
                  name="newPassword"
                  id="__password"
                />
              </div>
              <button
                type="submit"
                class="btn btn-primary d-flex my-0 mx-auto"
                data-bs-dismiss="modal"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" id="loginModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Login</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form action="" @submit.prevent="login">
              <div class="form-group mb-3">
                <label class="form-label" for="_username">Username</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="loginUsername"
                  name="loginUsername"
                  id="_username"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label" for="_password">Password</label>
                <input
                  class="form-control"
                  type="password"
                  v-model="loginPassword"
                  name="loginPassword"
                  id="_password"
                />
              </div>
              <button
                type="submit"
                class="btn btn-primary d-flex my-0 mx-auto"
                data-bs-dismiss="modal"
              >
                Login
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
            <li class="nav-item" v-show="userStore.token != null">
              <RouterLink to="/scores" class="nav-link">Scores</RouterLink>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-show="userStore.token != null">
              <RouterLink to="/myprofile" class="nav-link"
                >My Profile</RouterLink
              >
            </li>
            <li class="nav-item" v-if="userStore.token === null">
              <button
                class="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
              >
                Log in
              </button>
            </li>
            <li class="nav-item" v-else>
              <button class="btn btn-outline-secondary" @click="logout">
                Log out
              </button>
            </li>
            <li class="nav-item" v-show="userStore.token === null">
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
import { useUserStore } from "@/stores/userSlice";
import * as api from "@/shared/api";

export default defineComponent({
  name: "header",
  setup() {
    //pinia state
    const userStore = useUserStore();

    //data
    const createUsername = ref("");
    const createPassword = ref("");

    const loginUsername = ref("");
    const loginPassword = ref("");

    //methods
    const createAccount = () => {
      api.createAccount({
        username: createUsername.value,
        password: createPassword.value,
      });
    };

    const login = () => {
      const login = api.loginUser({
        username: loginUsername.value,
        password: loginPassword.value,
      });

      login
        .then((response) => {
          if (response.token != null && response.userId != null) {
            userStore.login(response.token, response.userId);
          }
        })
        .catch((err) => console.log(err));
    };

    const logout = () => {
      api.logoutUser(userStore.token!).catch((err) => console.log(err));
      userStore.logout();
    };

    return {
      userStore,
      createUsername,
      createPassword,
      loginUsername,
      loginPassword,
      createAccount,
      login,
      logout,
    };
  },
});
</script>

<style></style>
