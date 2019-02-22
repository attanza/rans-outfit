<template>
  <section id="slider">
    <!--slider-->
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div id="slider-carousel" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#slider-carousel" data-slide-to="0" class="active"></li>
              <li data-target="#slider-carousel" data-slide-to="1"></li>
              <li data-target="#slider-carousel" data-slide-to="2"></li>
            </ol>

            <div class="carousel-inner">
              <div
                :class="{'item': true, 'active': index == 0}"
                v-for="(slider, index) in sliders"
                :key="slider.id"
              >
                <div class="col-sm-6">
                  <h1>{{ slider.title }}</h1>
                  <h2>{{ slider.small_title }}</h2>
                  <p>{{ slider.description }}</p>
                  <button type="button" class="btn btn-default get">Get it now</button>
                </div>
                <div class="col-sm-6">
                  <img :src="slider.url" class="girl img-responsive" alt>
                </div>
              </div>
            </div>

            <a href="#slider-carousel" class="left control-carousel hidden-xs" data-slide="prev">
              <i class="fa fa-angle-left"></i>
            </a>
            <a href="#slider-carousel" class="right control-carousel hidden-xs" data-slide="next">
              <i class="fa fa-angle-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { FRONT_BANNER_URL } from "../utils/apis.js";
export default {
  data() {
    return {
      sliders: []
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
