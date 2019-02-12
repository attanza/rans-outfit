<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap class="mt-3 px-2">
                <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                  <div v-if="!inArray(notIncluded, f.key)">
                    <label>{{ f.caption }}</label>
                    <v-text-field
                      v-validate="f.rules"
                      v-model="formData[f.key]"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                      :data-vv-as="f.caption"
                    />
                  </div>

                  <div v-if="f.key == 'is_main'">
                    <v-flex sm6 xs12>
                      <v-switch v-model="formData[f.key]" label="Use as main" color="primary"/>
                    </v-flex>
                  </div>

                  <div v-if="f.key == 'is_publish'">
                    <v-flex sm6 xs12>
                      <v-switch v-model="formData[f.key]" label="Use as publish" color="primary"/>
                    </v-flex>
                  </div>

                  <div v-if="f.key == 'description'">
                    <label>{{ f.caption }}</label>
                    <v-textarea
                      v-validate="f.rules"
                      v-model="formData[f.key]"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                      :data-vv-as="f.caption"
                    />
                  </div>
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click.native="onClose">Close</v-btn>
          <v-btn color="primary" @click.native="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "../../mixins";
import { PRODUCT_MEDIA_URL } from "../../utils/apis";
import catchError, { showNoty } from "../../utils/catchError";
import debounce from "lodash/debounce";
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
    media: {
      type: Object,
      required: false,
      default: {}
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: "Edit Media",
      fillable: [
        {
          key: "caption",
          caption: "Caption",
          value: "",
          rules: "max:50"
        },
        { key: "is_main", caption: "Main", value: "", rules: "boolean" },
        { key: "is_publish", caption: "Publish", value: "", rules: "boolean" },
        {
          key: "description",
          caption: "Description",
          value: "",
          rules: ""
        }
      ],
      formData: {},
      notIncluded: ["is_main", "is_publish", "description"]
    };
  },
  watch: {
    show() {
      this.dialog = this.show;
    },
    media() {
      if (this.media) {
        this.setField();
      }
    }
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
    setField() {
      this.fillable.forEach(
        data => (this.formData[data.key] = this.media[data.key])
      );
      this.errors.clear();
    },
    onClose() {
      this.clearForm();
      this.$emit("onClose");
    },
    clearForm() {
      this.caption = "";
      this.description = "";
      this.is_main = false;
      this.is_publish = false;
      this.dialog = false;
      this.errors.clear();
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
        this.formData.product_id = this.product_id;
        const resp = await axios
          .put(`${PRODUCT_MEDIA_URL}/${this.media.id}`, this.formData)
          .then(res => res.data);
        if (resp.meta.status === 200) {
          showNoty("Media Updated", "success");
          this.$emit("onUpdate", resp.data);
          this.clearForm();
        }
        this.deactivateLoader();
      } catch (e) {
        this.dialog = false;
        this.deactivateLoader();
        catchError(e);
      }
    }
  }
};
</script>
