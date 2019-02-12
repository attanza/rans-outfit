<template>
  <div>
    <h2 class="primary--text mb-2">Product Detail</h2>
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#description">Descriptions</v-tab>
      <v-tab href="#attributes">Attributes</v-tab>
      <v-tab href="#medias">Media</v-tab>
      <v-tab-item :value="'detail'">
        <detail-form/>
      </v-tab-item>
      <v-tab-item :value="'description'">
        <description :is-edit="isEdit"/>
      </v-tab-item>
      <v-tab-item :value="'attributes'">
        <attributes :is-edit="isEdit"/>
      </v-tab-item>
      <v-tab-item :value="'medias'">
        <uploadMedia :is-edit="isEdit"/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
import { PRODUCT_URL, COMBO_DATA_URL } from "../../utils/apis";
import catchError from "../../utils/catchError";
import { global } from "../../mixins";
import detailForm from "./detailForm";
import description from "./description";
import attributes from "./attributes";
import uploadMedia from "./uploadMedia";

export default {
  components: { detailForm, description, attributes, uploadMedia },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEdit: true
    };
  },
  mixins: [global],
  mounted() {
    this.setCurrentEdit();
  },
  methods: {
    async setCurrentEdit() {
      try {
        const resp = await axios
          .get(`${PRODUCT_URL}/${this.id}`)
          .then(res => res.data);
        if (resp.meta.status === 200) {
          this.$store.commit("currentEdit", resp.data);
        }

        const comboDataResponse = await axios
          .get(`${COMBO_DATA_URL}?resource=StockStatus`)
          .then(res => res.data);
        this.$store.commit("stockStatus", comboDataResponse.data);

        const categoryResponse = await axios
          .get(`${COMBO_DATA_URL}?resource=ProductCategory&sort_by=name`)
          .then(res => res.data);
        this.$store.commit("productCategories", categoryResponse.data);
      } catch (e) {
        catchError(e);
      }
    }
  }
};
</script>