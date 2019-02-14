<template>
  <v-card>
    <form>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <label>Short Description</label>
            <ckeditor :editor="editor" v-model="short_description" :config="editorConfig"></ckeditor>
          </v-flex>
          <v-flex xs12>
            <label>Long Description</label>
            <ckeditor :editor="editor" v-model="long_description" :config="editorConfig"></ckeditor>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions v-if="isEdit">
        <v-spacer></v-spacer>
        <v-btn @click="submitUpdate" color="primary">Save</v-btn>
      </v-card-actions>
      <v-card-actions v-if="!isEdit">
        <v-btn @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="submit" color="primary">
          <v-icon>navigate_next</v-icon>
        </v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>
<script>
import { PRODUCT_DESCRIPTION_URL } from "../../utils/apis";
import catchError, { showNoty } from "../../utils/catchError";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { global, product } from "../../mixins";

export default {
  mixins: [global, product],
  data() {
    return {
      id: "",
      short_description: "",
      long_description: ""
    };
  },
  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    description() {
      if (this.description) {
        const { id, short_description, long_description } = this.description;
        this.id = id;
        this.short_description = short_description;
        this.long_description = long_description;
      }
    }
  },
  computed: {
    description() {
      if (this.currentEdit && this.currentEdit.description) {
        return this.currentEdit.description;
      }
      return null;
    },
    product_id() {
      if (this.currentEdit) {
        return this.currentEdit.id;
      }
      return null;
    }
  },
  methods: {
    async submit() {
      try {
        console.log("this.product_id", this.product_id);
        console.log("this.short_description", this.short_description);
        console.log("this.long_description", this.long_description);

        if (
          this.product_id &&
          (this.short_description != "" || this.long_description != "")
        ) {
          const postData = {
            product_id: this.product_id,
            short_description: this.short_description,
            long_description: this.long_description
          };

          const resp = await axios
            .post(PRODUCT_DESCRIPTION_URL, postData)
            .then(res => res.data);
          if (resp.meta.status === 201) {
            this.$emit("onSaveDescription");
          }
        }
      } catch (e) {
        catchError(e);
      }
    },
    async submitUpdate() {
      try {
        const postData = {
          product_id: this.currentEdit ? this.currentEdit.id : null,
          short_description: this.short_description,
          long_description: this.long_description
        };
        if (this.id) {
          const resp = await axios
            .put(`${PRODUCT_DESCRIPTION_URL}/${this.id}`, postData)
            .then(res => res.data);
          if (resp.meta.status === 200) {
            showNoty("Data updated", "success");
          }
        } else {
          const resp = await axios
            .post(PRODUCT_DESCRIPTION_URL, postData)
            .then(res => res.data);
          if (resp.meta.status === 201) {
            // replicate current store and modify
            const storeData = Object.assign({}, this.currentEdit);
            storeData.description = resp.data;
            this.$store.commit("currentEdit", storeData);
            showNoty("Data saved", "success");
          }
        }
      } catch (e) {
        catchError(e);
      }
    },
    cancel() {
      window.location.replace("/admin/products");
    }
  }
};
</script>