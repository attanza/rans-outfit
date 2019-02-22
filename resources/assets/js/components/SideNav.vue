<template>
  <div class="left-sidebar">
    <h2>Category</h2>
    <div class="panel-group category-products" id="accordian">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title" style="margin-bottom: 30px;">
            <a href="#">Features</a>
          </h4>
          <h4
            class="panel-title"
            style="margin-bottom: 30px;"
            v-for="category in categories"
            :key="category.id"
          >
            <a href="#">{{ category.name }}</a>
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { COMBO_DATA_URL } from "../utils/apis.js";
export default {
  data() {
    return {
      categories: []
    };
  },
  mounted() {
    this.getCategory();
  },
  methods: {
    getCategory() {
      axios
        .get(COMBO_DATA_URL + "?resource=ProductCategory&sort_by=name")
        .then(res => {
          if (res.status === 200) {
            this.categories = res.data.data;
          }
        })
        .catch(e => console.log(e));
    }
  }
};
</script>
