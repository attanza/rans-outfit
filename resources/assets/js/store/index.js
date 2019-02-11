import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentEdit: null,
    stockStatus: null,
    productCategories: null
  },
  mutations: {
    currentEdit(state, val) {
      state.currentEdit = val;
    },
    stockStatus(state, val) {
      state.stockStatus = val;
    },
    productCategories(state, val) {
      state.productCategories = val;
    }
  }
});
