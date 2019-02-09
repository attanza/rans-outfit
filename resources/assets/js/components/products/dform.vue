<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="onClose">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="submit">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <form>
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
                  <v-textarea v-model="tags"></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <label>Short Description</label>
                  <ckeditor :editor="editor" v-model="short_description"></ckeditor>
                </v-flex>
                <v-flex xs12>
                  <label>Long Description</label>
                  <ckeditor :editor="editor" v-model="long_description"></ckeditor>
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { PRODUCT_URL, COMBO_DATA_URL } from "../../utils/apis";
import catchError from "../../utils/catchError";
import { global } from "../../mixins";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: "Add Product",
      dialog: true,
      fillable: [
        {
          key: "code",
          caption: "Product Code",
          value: "",
          rules: "max:50"
        },
        {
          key: "name",
          caption: "Product Name",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "regular_price",
          caption: "Regular Price",
          value: "",
          rules: "required|integer"
        },
        {
          key: "sell_price",
          caption: "Sell Price",
          value: "",
          rules: "integer"
        },
        {
          key: "discount",
          caption: "Discount",
          value: "",
          rules: "integer"
        },
        {
          key: "tax",
          caption: "Tax",
          value: "",
          rules: "integer"
        },
        {
          key: "stock",
          caption: "Stock",
          value: "",
          rules: "integer"
        },
        {
          key: "ordering",
          caption: "Menu Ordering",
          value: "",
          rules: "integer"
        },
        {
          key: "stock_status_id",
          caption: "Stock Status",
          value: "",
          rules: "required|integer"
        },
        {
          key: "is_featured",
          caption: "Make featured",
          value: "",
          rules: ""
        },
        {
          key: "is_publish",
          caption: "Publish",
          value: "",
          rules: ""
        }
      ],
      formData: {},
      stockStatus: [],
      typeNumbers: [
        "regular_price",
        "sell_price",
        "discount",
        "tax",
        "stock",
        "ordering"
      ],
      notInclude: ["stock_status_id", "is_featured", "is_publish"],
      editor: ClassicEditor,
      editorData: "",
      tags: "",
      short_description: "",
      long_description: ""
    };
  },
  watch: {
    show() {
      this.dialog = this.show;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const comboDataResponse = await axios
          .get(`${COMBO_DATA_URL}?resource=StockStatus`)
          .then(res => res.data);
        this.stockStatus = comboDataResponse.data;
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
        for (let key in this.formData) {
          if (this.formData[key] === "") this.formData[key] = null;
        }
        console.log("this.formData", this.formData);

        const resp = await axios
          .post(PRODUCT_URL, this.formData)
          .then(res => res.data);
        console.log("resp", resp);

        // if (resp.meta.status === 201) {
        //   showNoty("Data disimpan", "success");
        //   this.$emit("onAdd", resp.data);
        // }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    }
  }
};
</script>