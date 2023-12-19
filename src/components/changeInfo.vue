<template>
    <div>
        <div class="modal mb-5 pb-5" v-if="props.showInfoModal">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-header">
              <div class="modal-content">
                <div class="alert alert-success" v-if="sucss">{{ sucss }}</div>
                <div class="alert alert-danger" v-if="err">{{ err }}</div>
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Update Profile</h1>
                  <span class="close" @click="closeModal"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg></span>
              </div>
              <div class="modal-body content">
                <div>
                     <!-- First Name -->
        <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" class="form-control" id="firstName" placeholder="First Name" v-model="formData.firstname">
        </div>

        <!-- Last Name -->
        <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" class="form-control" id="lastName" placeholder="Last Name" v-model="formData.lastname">
        </div>

        <!-- Middle Name -->
        <div class="form-group">
            <label for="middleName">Middle Name</label>
            <input type="text" class="form-control" id="middleName" placeholder="Middle Name" v-model="formData.middlename">
        </div>

        <!-- Extension Name (Optional) -->
        <div class="form-group">
            <label for="extensionName">Extension Name (Optional)</label>
            <input type="text" class="form-control" id="extensionName" placeholder="Extension Name" v-model="formData.extention">
        </div>

        <!-- Gender -->
        <div class="form-group">
            <label>Gender</label>
            <div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="male" name="gender" class="custom-control-input" value="male" v-model="formData.gender">
                    <label class="custom-control-label" for="male">Male</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="female" name="gender" class="custom-control-input" value="female" v-model="formData.gender">
                    <label class="custom-control-label" for="female">Female</label>
                </div>
            </div>
        </div>

        <!-- Age -->
        <div class="form-group">
            <label for="age">Age</label>
            <input type="number" class="form-control" id="age" placeholder="Age" disabled v-model="formData.age">
        </div>
                    <div class="button-container mb-5">
                      <button class="change-profile-button btn btn-primary" type="button" @click="updateInfo">
                        <span v-if="!loading">Update Info</span>
                      <span v-else>loading....</span></button>
                    </div>
                </div>
              </div>
            </div>
            </div>
          </div>

  </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watchEffect } from "vue";
import AuthenticationService from '@/services/AuthenticationService'

const props = defineProps({
  info: Array,
  showInfoModal: Boolean,
});
console.log(props.info)
const emits = defineEmits(["closeInfoModal","restartInfo"]);

const closeModal = () => {
  emits("closeInfoModal");
};
const getInfo = ()=>{
    emits('restartInfo');
}

const loading = ref(false);

const sucss = ref('');
const err = ref('');
const formData = ref({
  firstname: '',
  lastname: '',
  middlename: '',
  extention: '',
  gender: '',
  age: '',
});


watchEffect(()=>{
    formData.value.firstname = props.info.firstname;
  formData.value.lastname = props.info.lastname;
  formData.value.middlename = props.info.middlename;
  formData.value.extention = props.info.extention;
  formData.value.gender = props.info.gender;
  formData.value.age = props.info.age;
})
const updateInfo = async()=>{
    loading.value =true;
    try {
        const response = await AuthenticationService.updateInfo({
            firstname:formData.value.firstname,
            lastname:formData.value.lastname,
            middlename:formData.value.middlename,
            extention:formData.value.extention,
            gender:formData.value.gender,
            age:formData.value.age,
        })
        if(response){
            setTimeout(() => {     
                console.log(response.data.msg)
                closeModal();
                getInfo
                loading.value = false
            }, 1000);
        }
    } catch (error) {
        setTimeout(() => {
            console.log(error)
            loading.value = false
        }, 1000);
    }
}

</script>

<style scoped>
.modal-body {
  overflow-y: scroll;
  height: 300px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.unread {
  background-color: #f7f7f7;
  border-left: 4px solid #2196f3;
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close {
  cursor: pointer;
}
</style>