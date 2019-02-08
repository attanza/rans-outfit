import Vue from "vue";

import axios from "axios";
import SampleComponent from "./components/SampleComponent";
window.Vue = Vue;
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
let token = document.querySelector('[name="_csrf"]');
if (token) {
  window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
} else {
  console.error(
    "CSRF token not found: https://adonisjs.com/docs/3.2/csrf-protection"
  );
}

const app = new Vue({
  el: "#app",
  // global-standalone components
  components: {
    SampleComponent
  }
});
