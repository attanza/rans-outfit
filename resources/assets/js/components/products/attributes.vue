<template>
  <v-card>
    <v-container>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <label>Name</label>
            <v-combobox
              v-model="attributeName"
              :items="attributeNames"
              label="Select attribute name"
            ></v-combobox>
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
                  <v-btn @click="delItem(index)" icon color="primary" dark>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions v-if="!isEdit">
        <v-btn @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="submit" color="primary">
          <v-icon>navigate_next</v-icon>
        </v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>
<script>
import { global, product } from "../../mixins";
import { PRODUCT_ATTRIBUTE_URL } from "../../utils/apis";
import catchError, { showNoty } from "../../utils/catchError";
export default {
  mixins: [global, product],
  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      name: "",
      value: ""
    };
  },
  watch: {
    atributeStore() {
      if (this.atributeStore) {
        this.attributes = this.atributeStore;
      }
    }
  },
  computed: {
    product_id() {
      if (this.currentEdit) {
        return this.currentEdit.id;
      }
      return null;
    },
    atributeStore() {
      if (this.currentEdit && this.currentEdit.attributes) {
        return this.currentEdit.attributes;
      }
      return null;
    }
  },
  methods: {
    async addAttribute() {
      try {
        if (!this.isEdit) {
          if (this.attributeName != "" && this.attributeValue != "") {
            this.attributes.push({
              name: this.attributeName,
              value: this.attributeValue
            });
            this.attributeName = "";
            this.attributeValue = "";
          }
        } else {
          if (this.attributeName != "" && this.attributeValue != "") {
            const postData = {
              product_id: this.product_id,
              name: this.attributeName,
              value: this.attributeValue
            };
            const resp = await axios
              .post(PRODUCT_ATTRIBUTE_URL, postData)
              .then(res => res.data);
            if (resp.meta.status === 201) {
              const storeData = Object.assign({}, this.currentEdit);
              storeData.attributes.unshift(resp.data);
              this.$store.commit("currentEdit", storeData);
              this.attributeName = "";
              this.attributeValue = "";
              showNoty("Attribute added", "success");
            }
          }
        }
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    async delItem(index) {
      try {
        if (!this.isEdit) {
          this.attributes.splice(index, 1);
        } else {
          const attributeToDelete = this.attributes[index];
          const storeData = Object.assign({}, this.currentEdit);
          storeData.attributes.splice(index, 1);
          this.$store.commit("currentEdit", storeData);
          const resp = await axios
            .delete(`${PRODUCT_ATTRIBUTE_URL}/${attributeToDelete.id}`)
            .then(res => res.data);
          if (resp.meta.status === 200) {
            showNoty("Attribute deleted", "success");
          }
        }
      } catch (e) {
        catchError(e);
      }
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