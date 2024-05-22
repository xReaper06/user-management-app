<template>
  <div>
    <div class="card">
      <div class="card-body">
        <!-- Add new Task form -->
        <div class="form-floating mb-3 mt-4">
          <div class="fs-3 text-center">
            <strong>Add new Task</strong>
          </div>
          <input
            type="text"
            class="form-control"
            name="task"
            id="task"
            placeholder="Enter Task..."
            v-model="task"
            required
          />
          <label for="task">Task</label>
        </div>

        <!-- Time Duration input -->
        <div class="form-floating mb-3">
          <input
            type="time"
            class="form-control"
            name="time_duration"
            id="time_duration"
            placeholder="Input Time Duration"
            v-model="time_duration"
            required
          />
          <label for="time_duration">Time Duration</label>
        </div>

        <!-- Submit button -->
        <button
          type="button"
          class="btn btn-primary mb-3"
          @click="insertNewTask"
        >
          <span v-if="!loading">Submit</span>
          <span v-else>loading...</span>
        </button>

        <!-- Horizontal line -->
        <hr class="mb-5" />

        <!-- My Task section -->
        <div class="fs-3 text-center">
          <strong>My Task</strong>
          date
          <input
            type="date"
            id="timenow"
            name="timenow"
            v-model="timenow"
            @change="getTask"
          />
        </div>
        <hr />

        <!-- Task cards loop -->
        <div v-for="task in myTask" :key="task.id" class="mb-4">
          <div
            class=""
            :class="
              task.is_done == 0 ? 'card custom-card' : 'card custom-card done'
            "
          >
            <div
              v-if="overWork(task.time_duration)"
              class="card-header bg-danger"
            >
              OverWork !!!
            </div>
            <div class="card-body">
              <div class="d-flex flex-column flex-md-row align-items-center">
                <div class="me-md-5 mb-3 mb-md-0">
                  <h4 class="card-title">Task: {{ task.task }}</h4>
                  <p class="card-text">
                    Current Time({{ currentTime12Hour }}) - needs to be Done @(
                    {{ formatTimeTo12Hour(task.time_duration) }})
                  </p>
                </div>
                <div class="ms-md-5">
                  <div v-if="task.is_done == 0">
                    <button
                      type="button"
                      class="btn btn-primary me-3"
                      @click="doneTask(task.id)"
                    >
                      Done
                    </button>
                  </div>
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="removeTask(task.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 700px;
  margin: 2% auto;
  background-color: beige;
}

.custom-card {
  max-width: 600px;
  background-color: white;
}
.done {
  background-color: #00ff99;
  text-decoration-line: line-through;
}

@media (max-width: 576px) {
  .card {
    margin: 5% auto;
  }
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import AuthenticationService from "@/services/AuthenticationService";
import { successRes, errorRes } from "@/services/newService";
const myTask = ref([]);
const task = ref("");
const time_duration = ref("");
const timenow = ref("");
const loading = ref(false);
const getTask = async () => {
  try {
    const response = await AuthenticationService.getTask({
      timenow: timenow.value,
    });
    if (response) {
      myTask.value = response.data.todoList;
    }
  } catch (error) {
    errorRes(error.response.data.message);
    console.log(error);
  }
};
const insertNewTask = async () => {
  loading.value = true;
  if (task.value == "" || time_duration.value == "") {
    setTimeout(() => {
      loading.value = false;
      console.log("please fill in empty spaces");
    }, 1000);
  } else {
    try {
      const response = await AuthenticationService.insertTask({
        task: task.value,
        time_duration: time_duration.value,
      });
      if (response) {
        setTimeout(() => {
          loading.value = false;
          successRes(response.data.message);
          task.value = "";
          time_duration.value = "";
          getTask();
        }, 1000);
      }
    } catch (error) {
      setTimeout(() => {
        loading.value = false;
        errorRes(error.response.data.message);
      }, 1000);
    }
  }
};
const doneTask = async (id) => {
  try {
    const response = await AuthenticationService.doneTask({
      id: id,
    });
    if (response) {
      successRes(response.data.message);
      getTask();
    }
  } catch (error) {
    errorRes(error.response.data.message);
  }
};
const removeTask = async (id) => {
  try {
    const response = await AuthenticationService.removeTask({
      id: id,
    });
    if (response) {
      successRes(response.data.message);

      getTask();
    }
  } catch (error) {
    errorRes(error.response.data.message);
  }
};
const formatTimeTo12Hour = (time24) => {
  // Parse the time string (assumes the input is in "HH:mm:ss" format)
  const [hours, minutes] = time24.split(":").map(Number);

  // Determine AM or PM
  const period = hours < 12 ? "AM" : "PM";

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12;

  // Format the time in 12-hour format
  const time12 = `${hours12}:${minutes} ${period}`;

  return time12;
};
const overWork = (date) => {
  const currentTime = getCurrentTimeNoSeconds();
  const taskTime = date;
  return currentTime > taskTime;
};
console.log(overWork());
function getCurrentTime12Hour() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Determine AM or PM
  const period = hours < 12 ? "AM" : "PM";

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12;

  // Format the time in 12-hour format
  const currentTime12Hour = `${hours12}:${padZero(minutes)}:${padZero(
    seconds
  )} ${period}`;

  return currentTime12Hour;
}

// Function to pad a number with zero if it's a single digit
function padZero(number) {
  return number < 10 ? `0${number}` : `${number}`;
}
function getCurrentTimeNoSeconds() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  // Format the time in 12-hour format
  const currentTime12Hour = `${padZero(hours)}:${padZero(minutes)}:${padZero(
    seconds
  )}`;

  return currentTime12Hour;
}

// Example usage
const currentTime12Hour = getCurrentTime12Hour();

function getCurrentDate() {
  const now = new Date();

  // Get the year, month, and day
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = now.getDate();

  // Format the date as YYYY-MM-DD
  timenow.value = `${year}-${padZero(month)}-${padZero(day)}`;

  return timenow.value;
}

// Example usage
const currentDate = getCurrentDate();
console.log(currentDate);

onMounted(() => {
  getTask();
});
</script>
