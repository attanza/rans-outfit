<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex v-for="(f, index) in fillable" :key="index" xs12 sm6>
          <div v-if="!inArray(notInclude, f.key)">
            <label>{{ f.caption }}</label>
            <v-text-field
              v-validate="f.rules"
              v-model="formData[f.key]"
              :error-messages="errors.collect(f.key)"
              :name="f.key"
              :data-vv-name="f.key"
              :data-vv-as="f.caption"
              :type="inArray(typeNumbers, f.key) ? 'number': 'text'"
            />
          </div>
          <div v-if="f.key === 'product_category_id' && productCategories">
            <label>{{ f.caption }}</label>
            <v-autocomplete
              v-validate="f.rules"
              :items="productCategories"
              :error-messages="errors.collect(f.key)"
              :data-vv-name="f.key"
              :data-vv-as="f.caption"
              v-model="formData[f.key]"
              single-line
              item-text="name"
              item-value="id"
            />
          </div>
          <div v-if="f.key === 'stock_status_id' && stockStatus">
            <label>{{ f.caption }}</label>
            <v-autocomplete
              v-validate="f.rules"
              :items="stockStatus"
              :error-messages="errors.collect(f.key)"
              :data-vv-name="f.key"
              :data-vv-as="f.caption"
              v-model="formData[f.key]"
              single-line
              item-text="name"
              item-value="id"
            />
          </div>
          <div v-if="f.key === 'is_featured' || f.key === 'is_publish'">
            <label>{{ f.caption }}</label>
            <v-switch v-model="formData[f.key]" color="primary"></v-switch>
          </div>
        </v-flex>
        <v-flex xs12>
          <label>Tags</label>
          <v-textarea
            v-model="formData.tags"
            auto-grow
            placeholder="Ex: #women, #outter (separate by comma)"
          ></v-textarea>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="cancel">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="submit">
        <v-icon>navigate_next</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { global, product } from "../../mixins";
import { PRODUCT_URL, COMBO_DATA_URL } from "../../utils/apis";
import catchError from "../../utils/catchError";
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global, product],
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
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
    },
    onClose() {
      this.$emit("onClose");
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.saveData();
          return;
        }
      });
    },
    async saveData() {
      try {
        this.activateLoader();
        this.formData.attributes = this.attributes;
        this.formData.shipping = this.shipping;
        for (let key in this.formData) {
          if (this.formData[key] === "") this.formData[key] = null;
        }
        const resp = await axios
          .post(PRODUCT_URL, this.formData)
          .then(res => res.data);

        if (resp.meta.status === 201) {
          this.$emit("onSaveProduct");
          this.$store.commit("currentEdit", resp.data);
          this.formData = {};
        }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    addAttribute() {
      if (this.attributeName != "" && this.attributeValue != "") {
        this.attributes.push({
          name: this.attributeName,
          value: this.attributeValue
        });
        this.attributeName = "";
        this.attributeValue = "";
      }
    },
    cancel() {
      window.location.replace("/admin/products");
    }
  }
};
</script>
