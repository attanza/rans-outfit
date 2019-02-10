<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <form>
          <v-toolbar color="primary" dark>
            <v-btn icon @click="onClose">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="submit">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
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
                  <div v-if="f.key === 'product_category_id' && categories">
                    <label>{{ f.caption }}</label>
                    <v-autocomplete
                      v-validate="f.rules"
                      :items="categories"
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
              <v-layout row wrap>
                <v-flex xs12>
                  <v-expansion-panel>
                    <v-expansion-panel-content>
                      <div slot="header">Product Descriptions</div>
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
                        <ckeditor
                          :editor="editor"
                          v-model="formData.long_description"
                          :config="editorConfig"
                        ></ckeditor>
                      </v-flex>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-flex>
                <v-flex xs12>
                  <v-expansion-panel>
                    <v-expansion-panel-content>
                      <div slot="header">Product Attributes</div>
                      <v-container>
                        <v-layout row wrap>
                          <v-flex xs12>
                            <v-btn @click="addAttribute" color="primary">Add</v-btn>
                          </v-flex>
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
                            <v-text-field
                              v-model="attributeValue"
                              placeholder="ex: S|M|L (separate by pipe)"
                            />
                          </v-flex>
                          <v-flex v-if="attributes.length" xs12>
                            <table class="table is-narrow is-fullwidth">
                              <tr>
                                <th>Name</th>
                                <th>Value</th>
                              </tr>
                              <tr v-for="(attr, index) in attributes" :key="index">
                                <td>{{attr.name}}</td>
                                <td>{{attr.value}}</td>
                              </tr>
                            </table>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-flex>
                <v-flex xs12>
                  <v-expansion-panel>
                    <v-expansion-panel-content>
                      <div slot="header">Product Shipping</div>
                      <v-container>
                        <v-layout row wrap>
                          <v-flex xs12 sm6>
                            <label>Weight</label>
                            <v-text-field v-model="shipping.wight" type="number"/>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <label>Height</label>
                            <v-text-field v-model="shipping.height" type="number"/>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <label>Length</label>
                            <v-text-field v-model="shipping.length" type="number"/>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <label>Width</label>
                            <v-text-field v-model="shipping.width" type="number"/>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="submit">Save</v-btn>
          </v-card-actions>
        </form>
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
      dialog: false,
      fillable: [
        {
          key: "code",
          caption: "Product Code",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "product_category_id",
          caption: "Category",
          value: "",
          rules: "required|integer"
        },
        {
          key: "name",
          caption: "Product Name",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "material",
          caption: "Product Material",
          value: "",
          rules: "max:250"
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
      categories: [],
      typeNumbers: [
        "regular_price",
        "sell_price",
        "discount",
        "tax",
        "stock",
        "ordering"
      ],
      notInclude: [
        "product_category_id",
        "stock_status_id",
        "is_featured",
        "is_publish"
      ],
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "bulletedList",
          "numberedList",
          "blockQuote"
        ]
      },
      attributeNames: ["color", "size"],
      attributeName: "",
      attributeValue: "",
      attributes: [],
      shipping: {}
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

        const categoryResponse = await axios
          .get(`${COMBO_DATA_URL}?resource=ProductCategory&sort_by=name`)
          .then(res => res.data);
        this.categories = categoryResponse.data;
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
    }
  }
};
</script>