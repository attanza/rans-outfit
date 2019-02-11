<template>
  <div>
    <form>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12>
              <label>Short Description</label>
              <ckeditor
                :editor="editor"
                v-model="formData.short_description"
                :config="editorConfig"
              ></ckeditor>
            </v-flex>
            <v-flex xs12>
              <label>Long Description</label>
              <ckeditor :editor="editor" v-model="formData.long_description" :config="editorConfig"></ckeditor>
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
    descriptionData() {
      this.formData["short_description"] = this.descriptionData.description
        ? this.descriptionData.description.short_description
        : "";
      this.formData["long_description"] = this.descriptionData.description
        ? this.descriptionData.description.long_description
        : "";

      this.formData;
    }
  },
  computed: {
    descriptionData() {
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