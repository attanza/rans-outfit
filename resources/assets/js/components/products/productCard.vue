<template>
  <div class="products-catagories-area clearfix">
    <div class="amado-pro-catagory clearfix">
      <div class="single-products-catagory clearfix">
        <a href="shop.html">
          <img src="img/bg-img/1.jpg" alt>
          <!-- Hover Content -->
          <div class="hover-content">
            <div class="line"></div>
            <p>From $180</p>
            <h4>Modern Chair</h4>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      products: [],
      n: 0
    };
  },
  mounted() {
    this.getFeatured();
  },
  methods: {
    getFeatured() {
      axios
        .get("/api/v1/get-featured")
        .then(resp => {
          if (resp.status === 200) {
            this.products = resp.data;
          }
        })
        .catch(e => console.log(e));
    },
    toDetail(product) {}
  }
};
</script>