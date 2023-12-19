<template>
    <div class="container mt-5 mb-5">
        <div class="card">
            <div class="card-header">
                <div class="fs-4 text-center">
                    <strong>
                        Sign Up
                    </strong>
                </div>
            </div>
            <div class="card-body">
                <form @submit.prevent="userRegistration">
                  <div v-if="showFile" class="mb-3">
                    <img :src="fileView.preview" alt="Selected Image" class="img-thumbnail">
                  </div>
            
                  <!-- Image Input -->
                  <div class="mb-3">
                    <label for="imageInput" class="form-label">Profile Image</label>
                    <input type="file" class="form-control" id="imageInput" accept="image/jpg,image/png,image/jpeg" @change="handleimageChange">
                  </div>
            
                  <!-- Email -->
                  <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="email">
                  </div>
            
                  <!-- Password -->
                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" @keyup="isStrongPassword" v-model="password">
                    <div class="text-danger" v-if="passmsgVisible">
                      {{ passmsg }}
                    </div>
                  </div>
            
                  <!-- Confirm Password -->
                  <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm Password" v-model="confirm_password">
                  </div>
            
                  <!-- First Name -->
                  <div class="mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" placeholder="First Name" v-model="formData.firstname">
                  </div>
            
                  <!-- Last Name -->
                  <div class="mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" placeholder="Last Name" v-model="formData.lastname">
                  </div>
            
                  <!-- Middle Name -->
                  <div class="mb-3">
                    <label for="middleName" class="form-label">Middle Name</label>
                    <input type="text" class="form-control" id="middleName" placeholder="Middle Name" v-model="formData.middlename">
                  </div>
            
                  <!-- Extension Name (Optional) -->
                  <div class="mb-3">
                    <label for="extensionName" class="form-label">Extension Name (Optional)</label>
                    <input type="text" class="form-control" id="extensionName" placeholder="Extension Name" v-model="formData.extention">
                  </div>
            
                  <!-- Gender -->
                  <div class="mb-3">
                    <label class="form-label me-2">Gender :</label>
                    <div class="form-check form-check-inline">
                      <input type="radio" id="male" name="gender" class="form-check-input" value="male" v-model="formData.gender">
                      <label class="form-check-label" for="male">Male</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input type="radio" id="female" name="gender" class="form-check-input" value="female" v-model="formData.gender">
                      <label class="form-check-label" for="female">Female</label>
                    </div>
                  </div>
            
                  <!-- Birthday -->
                  <div class="mb-3">
                    <label for="birthday" class="form-label">Birthday</label>
                    <input type="date" class="form-control" id="birthday" v-model="formData.birthday" @change="updateAge">
                  </div>
            
                  <!-- Age -->
                  <div class="mb-3">
                    <label for="age" class="form-label">Age</label>
                    <input type="number" class="form-control" id="age" placeholder="Age" disabled v-model="formData.age">
                  </div>
            
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required>
                    <label class="form-check-label" for="invalidCheck">
                      Agree to terms and conditions
                    </label>
                  </div>
            
                  <button type="submit" class="btn btn-primary">
                    <span v-if="!loading">Sign up</span>
                    <span v-else>Loading...</span>
                    <i class="mdi mdi-chevron-right"></i>
                  </button>
                </form>
                <div class="text-center">
                    I Already have an <router-link to="/">account</router-link>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <style scoped>
  .card{
    width: 500px;
    background-color: beige;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .img-thumbnail {
    max-width: 100px;
    max-height: 100px;
  }
  
  .text-danger {
    color: #dc3545;
  }
  </style>
  

<script setup>
import axios from 'axios';
import { ref} from 'vue'
import router from '@/router';

    const email = ref('')
    const password = ref('');
    const confirm_password = ref('');
const fileView = ref({ preview: "" });
const showFile = ref(false);
const file = ref(null);
const msg = ref(null);
    const loading = ref(false)
    const passmsg = ref(null)
    const passmsgVisible = ref(false);
    const error = ref(false);
    const success = ref(false);
    const formData = ref({
        firstname:'',
        lastname:'',
        middlename:'',
        extention:'',
        gender:'',
        birthday:'',
        age:'',
    })

    const updateAge = () => {
    calculateAge(formData.value.birthday);
};

    const calculateAge= (birthdate)=> {
    // Get the current date
    var currentDate = new Date();

    // Convert the birthdate string to a Date object
    var birthDate = new Date(birthdate);

    // Calculate the age
     formData.value.age = currentDate.getFullYear() - birthDate.getFullYear();

    // Check if birthday has occurred this year
    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate())
    ) {
        formData.value.age--;
    }

    return formData.value.age;
}

const handleimageChange = (event)=>{
          const img = event.target.files;
    if (img.length > 0) {
      file.value = img[0];
  
      const reader = new FileReader();
      reader.onload = (e) => {
        fileView.value = {
          name: img[0].name,
          preview: e.target.result,
        };
        showFile.value = true;
      };
      reader.readAsDataURL(img[0]);
    }
}

const isStrongPassword = () => {
  // Define your criteria for a strong password
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password.value);
  const hasLowercase = /[a-z]/.test(password.value);
  const hasNumber = /\d/.test(password.value);

  // Check if the password meets the criteria
  if (
    password.value.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber
  ){
    passmsgVisible.value = false;
    passmsg.value = "Password is Strong";
  } else if(password.value == ''){
    passmsgVisible.value = false;
  } else {
    passmsgVisible.value = true;
    passmsg.value = "Password is Weak";
  }
};


const userRegistration = async ()=>{
      loading.value = true;
      let data = new FormData();
      if (password.value !== confirm_password.value) {
        msg.value = "Password doesn't match";
        loading.value = false;
      } else {
        try {
          if(email.value === '' || password.value === '' || confirm_password.value === ''){
            msg.value = 'Empty Inputs';
        loading.value = false;
          }else{
            data.append('image',file.value)
            data.append('email',email.value)
            data.append('password',password.value);
            data.append('firstname',formData.value.firstname)
            data.append('lastname',formData.value.lastname)
            data.append('middlename',formData.value.middlename)
            data.append('extention',formData.value.extention)
            data.append('gender',formData.value.gender)
            data.append('birthday',formData.value.birthday)
            data.append('age',parseInt(formData.value.age))
            const url = 'http://localhost:8081/api/userRegistration'
            const response = await axios.post(url,data);
            if(response){
              setTimeout(() => {
                email.value= ''
                password.value = '';
                confirm_password.value = '';
                formData.value.firstname = '';
                formData.value.lastname = '';
                formData.value.middlename = '';
                formData.value.extention = '';
                formData.value.gender = '';
                formData.value.birthday = '';
                formData.value.age = '';
                success.value = true;
                msg.value = response.data.msg; // Set success message
              },2000)
          router.push(`/verificationAccount/${response.data.Token}`);
            }
          }
        } catch (err) {
          console.error(err);
          error.value = true
          msg.value = err.response.data.msg;
        loading.value = false;
        }
      }
    }


</script>
