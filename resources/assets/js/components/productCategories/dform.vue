<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="primary--text headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap>
                <v-flex xs12>
                  <label>Name</label>
                  <v-text-field
                    v-validate="'required|max:50'"
                    v-model="name"
                    :error-messages="errors.collect('name')"
                    name="name"
                    data-vv-name="name"
                    data-vv-as="Name"
                  />
                </v-flex>
                <v-flex xs12>
                  <label>Description</label>
                  <v-textarea
                    v-validate="'max:250'"
                    v-model="description"
                    :error-messages="errors.collect('description')"
                    name="description"
                    data-vv-name="description"
                    data-vv-as="Description"
                  />
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click.native="onClose">Close</v-btn>
          <v-btn dark color="primary" @click.native="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { PRODUCT_CATEGORY_URL } from "../../utils/apis";
import catchError, { showNoty } from "../../utils/catchError";
import { global } from "../../mixins";
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    show: {
      type: Boolean,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    dataToEdit: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: "Add Product Category",
      name: "",
      description: ""
    };
  },
  watch: {
    show() {
      this.dialog = this.show;
    },
    isEdit() {
      if (this.isEdit) {
        this.setFields();
      }
    }
  },
  methods: {
    onClose() {
      this.$emit("onClose");
    },
    setFields() {
      if (this.dataToEdit) {
        this.name = this.dataToEdit.name;
        this.description = this.dataToEdit.description;
        this.formTitle = "Edit Product Category";
      }
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
        const formData = {
          name: this.name,
          description: this.description
        };
        if (this.isEdit) {
          const resp = await axios
            .put(`${PRODUCT_CATEGORY_URL}/${this.dataToEdit.id}`, formData)
            .then(res => res.data);

          if (resp.meta.status === 200) {
            showNoty("Data Updated", "success");
            this.$emit("onEdit", resp.data);
          }
        } else {
          const resp = await axios
            .post(PRODUCT_CATEGORY_URL, formData)
            .then(res => res.data);

          if (resp.meta.status === 201) {
            showNoty("Data Saved", "success");
            this.$emit("onAdd", resp.data);
          }
        }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    clearForm() {
      this.name = "";
      this.description = "";
      this.title = "Add Product Category";
    }
  }
};
</script>
