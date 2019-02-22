<template>
  <section id="slider">
    <!--slider-->
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <carousel :autoplay="true" :perPage="perPage" :loop="true" :autoplayTimeout="4000">
            <slide v-for="slider in sliders" :key="slider.id">
              <div class="col-sm-6 slider-flex">
                <h1>{{ slider.title }}</h1>
                <h3 style="color: #f5696a">{{ slider.small_title }}</h3>
                <p style="margin-top: 2rem;">{{ slider.description }}</p>
                <!-- <button type="button" class="btn btn-default get">Get it now</button> -->
              </div>
              <div class="col-sm-6">
                <img :src="slider.url" class="girl img-responsive" alt>
              </div>
            </slide>
          </carousel>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { FRONT_BANNER_URL } from "../utils/apis.js";
import { Carousel, Slide } from "vue-carousel";

export default {
  components: {
    Carousel,
    Slide
  },
  data() {
    return {
      sliders: [],
      perPage: 1
    };
  },
  mounted() {
    this.getSlider();
  },
  methods: {
    getSlider() {
      axios
        .get(FRONT_BANNER_URL)
        .then(res => {
          if (res.status === 200) {
            this.sliders = res.data;
            console.log("this.sliders", this.sliders);
          }
        })
        .catch(e => console.log("e", e));
    }
  }
};
</script>
<style scoped>
.slider-flex {
  font-family: "Raleway", sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
