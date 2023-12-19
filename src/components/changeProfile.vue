<template>
    <div>
        <div class="modal mb-5 pb-5" v-if="props.showProfileModal">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-header">
              <div class="modal-content">
                <div class="alert alert-success" v-if="sucss">{{ sucss }}</div>
                <div class="alert alert-danger" v-if="err">{{ err }}</div>
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Change Profile Picture</h1>
                  <span class="close" @click="closeModal"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg></span>
              </div>
              <div class="modal-body">
                <div>
                    <div v-if="showFile" class="image-container mb-3">
                      <img :src="fileView.preview" alt="Selected Image" class="preview-image img-fluid" style="width: 100px; height: 100px; border-radius: 50%; align-items: center;">
                    </div>
                    <div class="file-upload mb-3">
                      <input type="file" id="file" @change="handleImgChange" accept="image/png, image/jpeg, image/jpg" />
                    </div>
            
                    <div v-if="showButton" class="button-container mb-5">
                      <button class="change-profile-button btn btn-primary" type="button" @click="ChangeProfilePic" @touchstart="ChangeProfilePic" @touchend="ChangeProfilePic">
                        <span v-if="!loading">Change Profile Picture</span>
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
import { ref, defineProps, defineEmits } from "vue";
  import AuthenticationService from "@/services/AuthenticationService";
  
  const props = defineProps({
    showProfileModal: Boolean,
  });
  
  const emits = defineEmits(["closeProfileModal"]);
  
  const closeModal = () => {
    emits("closeProfileModal");
  };
  const loading = ref(false)
  const file = ref(null);
  const fileView = ref({ preview: "" });
  const showFile = ref(false);
  const showButton = ref(false);
  const profile = ref("");
  const sucss =ref('');
  const err = ref('')
 
  const handleImgChange = (event) => {
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
      showButton.value = true;
    }
  };
  
  const ChangeProfilePic = async () => {
    try {
      const data = new FormData();
      data.append("image", file.value);
      const response = await AuthenticationService.updateProfile(data);
      if (response) {
        loading.value = true
        setTimeout(()=>{
          profile.value = "";
          showButton.value = false;
          showFile.value = false;
          sucss.value = response.data.msg
          loading.value=false
        },2000)
        setTimeout(()=>{
          closeModal();
        },2000)
      }
    } catch (error) {
      console.log(error);
      err.value = error.response.data.msg
    }
  };

</script>

<style scoped>
.modal-body {
  overflow-y: scroll;
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