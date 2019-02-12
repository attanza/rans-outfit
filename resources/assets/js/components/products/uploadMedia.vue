<template>
  <div>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <label>Type</label>
            <v-autocomplete
              v-model="mediaType"
              :items="mediaTypes"
              label="Select media type"
              auto-select-first
              cache-items
              @change="checkType"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6>
            <label>Caption</label>
            <v-text-field v-model="caption"/>
          </v-flex>
          <v-flex xs12 sm6>
            <label>Use as main media ?</label>
            <v-switch v-model="is_main" color="primary"></v-switch>
          </v-flex>
          <v-flex xs12 sm6>
            <label>Publish Media</label>
            <v-switch v-model="is_publish" color="primary"></v-switch>
          </v-flex>
          <v-flex xs12>
            <v-checkbox v-model="is_upload" label="Upload media" color="primary"></v-checkbox>
          </v-flex>
          <v-flex v-if="!is_upload" xs12>
            <label>Url</label>
            <v-text-field v-model="url"/>
          </v-flex>
          <v-flex v-if="is_upload" xs12>
            <v-text-field
              v-model="imageName"
              label="Select Image"
              prepend-icon="attach_file"
              @click="pickFile"
            />
            <input
              ref="image"
              type="file"
              style="display: none"
              accept="image/*"
              @change="onFilePicked"
            >
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="warning" @click="submit">
          <v-icon>cloud_upload</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-text v-if="medias && medias.length">
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex v-for="(media, index) in medias" :key="media.id" d-flex xs12 sm6>
              <v-card>
                <v-img :src="media.url" height="150px" aspect-ratio="1"></v-img>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <Tbtn
                    icon="edit"
                    iconMode
                    tooltip-text="edit detail"
                    color="primary"
                    class="mr-2"
                    @onClick="editMedia(media, index)"
                  />
                  <Tbtn
                    icon="delete"
                    iconMode
                    tooltip-text="delete media"
                    color="primary"
                    @onClick="confirmDelete(media, index)"
                  />
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions v-if="!isEdit">
        <v-btn @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="cancel" color="primary">
          <v-icon>navigate_next</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <Dialog
      :showDialog="showDialog"
      text="Are you sure want to delete ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
    <mediaForm :show="show" @onClose="clearData" :media="currentMedia" @onUpdate="updatMedia"/>
  </div>
</template>

<script>
import { global } from "../../mixins";
import axios from "axios";
import { PRODUCT_MEDIA_URL } from "../../utils/apis";
import catchError from "../../utils/catchError";
import Dialog from "../Dialog";
import mediaForm from "./mediaForm";

export default {
  components: { Dialog, mediaForm },
  mixins: [global],
  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      index: "",
      currentMedia: null,
      showDialog: false,
      imageName: "",
      imageUrl: "",
      imageFile: "",
      mediaType: "image",
      caption: "",
      url: "",
      is_main: false,
      is_publish: false,
      description: "",
      mediaTypes: ["image", "video"],
      medias: [],
      is_upload: false,
      show: false
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
    mediaStore() {
      if (this.mediaStore) {
        this.medias = this.mediaStore;
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
    mediaStore() {
      if (this.currentEdit && this.currentEdit.medias) {
        return this.currentEdit.medias;
      }
      return null;
    }
  },
  methods: {
    checkType() {
      if (this.mediaType === "image") {
        this.is_upload = false;
      }
    },
    pickFile() {
      this.$refs.image.click();
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
    async submit() {
      try {
        this.activateLoader();
        let formData = new FormData();
        formData.append("file", this.imageFile);
        formData.append("product_id", "fIHxY7nbCfZjyiYhuWIsyHWU");
        formData.append("type", this.mediaType);
        formData.append("caption", this.caption);
        formData.append("url", this.url);
        formData.append("is_main", this.is_main);
        formData.append("is_publish", this.is_publish);

        const resp = await axios
          .post(PRODUCT_MEDIA_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => res.data);
        if (resp.meta.status === 201) {
          this.medias.push(resp.data);
        }

        this.clearData();
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    clearData() {
      this.imageName = "";
      this.imageFile = "";
      this.imageUrl = "";
      this.mediaType = "image";
      this.caption = "";
      this.url = "";
      this.is_main = false;
      this.is_publish = false;
      this.index = "";
      this.currentMedia = null;
      this.showDialog = false;
      this.show = false;
    },
    cancel() {
      window.location.replace("/admin/products");
    },
    confirmDelete(media, index) {
      this.index = index;
      this.currentMedia = media;
      this.showDialog = true;
    },
    async removeData() {
      try {
        if (this.isEdit) {
          this.activateLoader();
          const resp = await axios
            .delete(`${PRODUCT_MEDIA_URL}/${this.currentMedia.id}`)
            .then(res => res.data);
          if (resp.meta.status === 200) {
            this.medias.splice(this.index, 1);
            this.clearData();
            this.deactivateLoader();
          }
        } else {
          this.medias.splice(this.index, 1);
        }
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    editMedia(media, index) {
      this.index = index;
      this.currentMedia = media;
      this.show = true;
    },
    updatMedia(data) {
      this.medias.splice(this.index, 1, data);
      this.clearData();
    }
  }
};
</script>

<style scoped>
</style>
