<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
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
                <div v-if="f.key === 'description'">
                  <label>{{ f.caption }}</label>
                  <v-textarea
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
                    counter="250"
                  />
                </div>
                <div v-if="f.key === 'start_date'">
                  <label>{{ f.caption }}</label>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field slot="activator" v-model="formData[f.key]" readonly></v-text-field>
                    <v-date-picker v-model="formData[f.key]" @input="menu = false"></v-date-picker>
                  </v-menu>
                </div>
                <div v-if="f.key === 'end_date'">
                  <label>{{ f.caption }}</label>
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field slot="activator" v-model="formData[f.key]" readonly></v-text-field>
                    <v-date-picker v-model="formData[f.key]" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </div>
              </v-flex>
            </v-layout>
          </form>
          <div v-if="!isEdit">
            <v-text-field
              v-model="imageName"
              label="Select Image"
              prepend-icon="attach_file"
              @click="pickFile"
            />
            <input
              ref="fileData"
              type="file"
              style="display: none"
              accept="image/*"
              @change="onFilePicked"
            >
          </div>
        </v-container>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click.native="onClose">Tutup</v-btn>
          <v-btn color="primary" @click.native="submit">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "../../mixins";
import { BANNER_URL } from "../../utils/apis";
import catchError, { showNoty } from "../../utils/catchError";
import debounce from "lodash/debounce";
import moment from "moment";

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
      required: true
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
      fillable: [
        {
          key: "title",
          caption: "Title",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "small_title",
          caption: "Small Title",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "start_date",
          caption: "Start Date",
          value: null,
          rules: ""
        },
        {
          key: "end_date",
          caption: "End Date",
          value: null,
          rules: ""
        },
        {
          key: "description",
          caption: "Description",
          value: "",
          rules: "max:250"
        }
      ],
      notIncluded: ["description", "start_date", "end_date"],
      formData: {},
      formTitle: "Add Banner",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      menu: false,
      menu2: false
    };
  },

  watch: {
    show() {
      this.dialog = this.show;
    },
    isEdit() {
      if (this.isEdit && this.dataToEdit) {
        this.setFields();
      }
    }
  },
  created() {
    this.setFields();
  },
  methods: {
    onClose() {
      this.$emit("onClose");
    },
    setFields() {
      this.fillable.forEach(data => (this.formData[data.key] = data.value));
      this.errors.clear();
      if (this.isEdit && this.dataToEdit) {
        for (let key in this.dataToEdit) {
          if (this.dataToEdit.hasOwnProperty(key)) {
            this.formData[key] = this.dataToEdit[key];
          }
        }
        this.formData["start_date"] = moment(this.dataToEdit.start_date).format(
          "YYYY-MM-DD"
        );
        this.formData["end_date"] = moment(this.dataToEdit.end_date).format(
          "YYYY-MM-DD"
        );
      }
    },
    pickFile() {
      this.$refs.fileData.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.clearData();
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (!this.isEdit) {
            this.saveData();
            return;
          } else {
            this.editData();
            return;
          }
        }
      });
    },
    async saveData() {
      try {
        this.activateLoader();
        let formData = new FormData();
        for (var key in this.formData) {
          if (this.formData.hasOwnProperty(key)) {
            formData.append(key, this.formData[key]);
          }
        }
        formData.append("file", this.imageFile);
        const resp = await axios
          .post(BANNER_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => res.data);
        if (resp.meta.status === 201) {
          showNoty("Data saved", "success");
          this.$emit("onAdd", resp.data);
          this.setFields();
        }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    async editData() {
      try {
        this.activateLoader();
        const resp = await axios
          .put(BANNER_URL + "/" + this.dataToEdit.id, this.formData)
          .then(res => res.data);
        if (resp.meta.status === 200) {
          showNoty("Data updated", "success");
          this.$emit("onEdit", resp.data);
          this.setFields();
        }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    }
  }
};
</script>
