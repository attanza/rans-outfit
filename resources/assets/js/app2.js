import Vue from "vue";
import axios from "axios";

window.Vue = Vue;

window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
let token = document.querySelector('[name="_csrf"]');

if (token) {
  window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.value;
} else {
  console.error("CSRF token not found");
}

Vue.prototype.$bus = new Vue();
