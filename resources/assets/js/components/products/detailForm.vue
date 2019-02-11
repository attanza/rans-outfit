<template>
  <div>
    <form>
      <v-card-text>
        <v-container grid-list-md>
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
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="submit" color="primary">Save</v-btn>
      </v-card-actions>
    </form>
  </div>
</template>
<script>
import { global, product } from "../../mixins";

export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global, product],
  watch: {
    productData() {
      this.fillable.forEach(
        data => (this.formData[data.key] = this.productData[data.key])
      );
    }
  },
  computed: {
    productData() {
      if (this.currentEdit) {
        return this.currentEdit;
      }
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          console.log("this.formData", this.formData);

          return;
        }
      });
    }
  }
};
</script>