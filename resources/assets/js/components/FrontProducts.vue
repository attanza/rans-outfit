<template>
  <div class="features_items">
    <h1 class="title text-center">{{ title }}</h1>
    <span v-if="products && products.length">
      <div class="col-sm-4" v-for="product in products" :key="product.id">
        <div class="product-image-wrapper">
          <div class="single-products">
            <div class="productinfo text-center">
              <img :src="getMainMedia(product.medias)" alt>
              <h4>IDR {{ product.regular_price.toLocaleString() }}</h4>
              <h2>{{ product.name }}</h2>
              <!-- <a href="#" class="btn btn-default add-to-cart">
                <i class="fa fa-shopping-cart"></i>Add to cart
              </a>-->
            </div>
            <!-- <div class="product-overlay">
              <div class="overlay-content">
                <h2>$56</h2>
                <p>Easy Polo Black Edition</p>
                <a href="#" class="btn btn-default add-to-cart">
                  <i class="fa fa-shopping-cart"></i>Add to cart
                </a>
              </div>
            </div>-->
          </div>
          <!-- <div class="choose">
            <ul class="nav nav-pills nav-justified">
              <li>
                <a href="#">
                  <i class="fa fa-plus-square"></i>Add to wishlist
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-plus-square"></i>Add to compare
                </a>
              </li>
            </ul>
          </div>-->
        </div>
      </div>
    </span>
  </div>
</template>
<script>
import { FRONT_PRODUCT_URL } from "../utils/apis.js";
import catchError from "../utils/catchError";
import findIndex from "lodash/findIndex";
export default {
  data() {
    return {
      products: []
    };
  },
  props: {
    category: {
      type: String,
      required: false,
      default: ""
    },
    title: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.getProducts();
  },
  methods: {
    getProducts() {
      axios
        .get(`${FRONT_PRODUCT_URL}?category=${this.category}`)
        .then(res => {
          if (res.status === 200) {
            this.products = res.data.data;
            console.log("this.products", this.products);
          }
        })
        .catch(e => {
          catchError(e);
        });
    },
    getMainMedia(medias) {
      if (medias && medias.length) {
        const index = findIndex(medias, { is_main: 1 });
        if (index != -1) {
          return medias[index].url;
        } else {
          return "/images/shop/product8.jpg";
        }
      }
    }
  }
};
</script>
<style scoped>
h1 {
  color: #f5696a;
  margin: 0 auto 30px;
  text-align: center;
  text-transform: uppercase;
  position: relative;
}
</style>
