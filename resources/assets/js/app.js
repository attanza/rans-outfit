import Vue from "vue";
import VeeValidate from "vee-validate";
import Vuetify from "vuetify";
import axios from "axios";
import * as components from "./components";
import store from "./store";
import CKEditor from "@ckeditor/ckeditor5-vue";
import "vue2-dropzone/dist/vue2Dropzone.css";

window.Vue = Vue;

window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
let token = document.querySelector('[name="_csrf"]');

if (token) {
  window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.value;
} else {
  console.error(
    "CSRF token not found: https://adonisjs.com/docs/3.2/csrf-protection"
  );
}

Vue.use(VeeValidate);

Vue.use(Vuetify);

Vue.use(CKEditor);

Vue.prototype.$bus = new Vue();

const app = new Vue({
  el: "#app",
  store,
  components: {
    ...components
  }
});
