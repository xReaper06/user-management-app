<template>
    <div class="container mt-5">
      <div class="fs-2 text-center">
        Welcome to: <br /><strong>User Management App</strong>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="fs-4 text-center">
            <strong>Sign In</strong>
          </div>
        </div>
        <div class="card-body">
          <div class="col-md-6 offset-md-3">
            <form @submit.prevent="handleLogin">
              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" placeholder="Enter email" v-model="email">
              </div>
  
              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password" v-model="password">
              </div>
  
              <!-- Remember Me -->
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="rememberMe">
                <label class="form-check-label" for="rememberMe">Remember me</label>
              </div>
  
              <!-- Login Button -->
              <button type="submit" class="btn btn-primary btn-block">
                <span v-if="!loginloading">Login</span>
                <span v-else>loading...</span></button>
            </form>
            <div class="mt-3 text-end">
                <router-link to="/userRegistration" class="btn btn-success">Sign Up</router-link>
            </div>
            <!-- Forgot Password Link -->
            <div class="mt-3 text-center">
              <router-link to="/forgotPassword">Forgot password?</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/index.js';
  import { ref, onMounted } from 'vue';
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  const loginloading = ref(false);
  const routes = useRouter();
  const user = ref('');
  
  const getUser = localStorage.getItem('user');
  user.value = JSON.parse(getUser);
  
  const handleLogin = async () => {
    if (email.value === '' || password.value === '') {
      error.value = 'Fill in Empty Inputs';
    } else {
      // Simulate an asynchronous login operation (replace this with your actual login logic)
      let response;
      try {
        const url = 'http://localhost:8081/api/login';
        const data = {
          email: email.value,
          password: password.value,
        };
        response = await axios.post(url, data);
        loginloading.value = true;
        error.value = '';
        if (response) {
          setTimeout(() => {
            if (response.data.user.flag == 2) {
              routes.push('/accountDeleted');
            } else if (response.data.user.flag == 0) {
              routes.push('/temporaryLock');
            } else if (response.data.user.is_verified == 0) {
              routes.push(`/verifyAccount/${response.data.accessToken}`);
            } else {
              const authStore = useAuthStore();
              // Set the user and token
              authStore.setUser(response.data.user); // Assuming the user data is in response.data.user
              authStore.setTokens(response.data.accessToken, response.data.refreshToken);
              if (response.data.user !== null) {
                routes.push('/user/userDashboard');
              } else {
                loginloading.value = false; // Reset loading to false
              }
            }
          }, 1000);
        }
      } catch (err) {
        loginloading.value = true; // Reset loading to false
        setTimeout(() => {
          error.value = err.response.data.msg;
          loginloading.value = false; // Reset loading to false
        }, 1000);
      }
    }
  };
  
  const backtoDashboard = () => {
    try {
      if (user.value !== '') {
        routes.push('/user/userDashboard');
      } else {
        routes.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  onMounted(() => {
    backtoDashboard();
  });
  
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .card {
    width: 100%;
    max-width: 400px;
    margin: auto;
    margin-top: 20px;
    background-color: beige;
  }
  </style>
  