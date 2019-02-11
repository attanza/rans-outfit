<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <label>Name</label>
          <v-combobox v-model="attributeName" :items="attributeNames" label="Select attribute name"></v-combobox>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Value</label>
          <v-text-field v-model="attributeValue" placeholder="ex: S|M|L (separate by pipe)"/>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="addAttribute" color="primary" icon>
        <v-icon>add</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-text>
      <v-layout>
        <v-flex xs12>
          <table class="table is-narrow is-fullwidth">
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th></th>
            </tr>
            <tr v-for="(attr, index) in attributes" :key="index">
              <td>{{attr.name}}</td>
              <td>{{attr.value}}</td>
              <td align="right">
                <v-btn @click="delItem(index)" icon>
                  <v-icon>delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="cancel">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="submit" color="primary">
        <v-icon>navigate_next</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { global, product } from "../../mixins";
import { PRODUCT_ATTRIBUTE_URL } from "../../utils/apis";
import catchError from "../../utils/catchError";
export default {
  mixins: [global, product],
  computed: {
    product_id() {
      if (this.currentEdit) {
        return this.currentEdit.id;
      }
      return null;
    }
  },
  methods: {
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
    delItem(index) {
      this.attributes.splice(index, 1);
    },
    cancel() {
      window.location.replace("/admin/products");
    },
    async submit() {
      try {
        if (this.product_id && this.attributes.length) {
          const resp = await axios
            .post(PRODUCT_ATTRIBUTE_URL, {
              product_id: this.product_id,
              attributes: this.attributes
            })
            .then(res => res.data);
          if (resp.meta.status === 201) {
            this.$emit("onSaveAttribute");
          }
        }
      } catch (e) {
        catchError(e);
      }
    }
  }
};
</script>