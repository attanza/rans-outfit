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
      <v-card-actions>
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
import catchError from "../../utils/catchError";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { global, product } from "../../mixins";

export default {
  mixins: [global, product],
  data() {
    return {
      short_description: "",
      long_description: ""
    };
  },
  computed: {
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
    cancel() {
      window.location.replace("/admin/products");
    }
  }
};
</script>