<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <Tbtn
          :bottom="true"
          :tooltip-text="'Add ' + title "
          icon-mode
          color="primary"
          icon="add"
          @onClick="showForm = true"
        />
        <v-spacer/>
        <v-text-field
          v-model="pagination.search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :rows-per-page-items="rowsPerPage"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>
            <a @click="toDetail(props.item)">{{ props.item.title }}</a>
          </td>
          <td>{{ props.item.small_title}}</td>
          <td>
            <a :href="props.item.url" target="_blank">
              <v-img v-if="props.item.url" :src="props.item.url" height="40"/>
            </a>
          </td>
          <td class="justify-center layout px-0">
            <Tbtn
              :tooltip-text="'Delete'"
              icon-mode
              flat
              color="primary"
              icon="delete"
              @onClick="showConfirm(props.item)"
            />
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform
      :show="showForm"
      @onClose="onClose"
      @onAdd="addData"
      @onEdit="editData"
      :is-edit="isEdit"
      :data-to-edit="dataToEdit"
    />
    <Dialog
      :showDialog="showDialog"
      text="Are you sure want to delete ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>
<script>
import { BANNER_URL } from "../../utils/apis";
import { global } from "../../mixins";
import dform from "./dform";
import Dialog from "../Dialog";
import catchError, { showNoty } from "../../utils/catchError";
import debounce from "lodash/debounce";
import findIndex from "lodash/findIndex";
export default {
  components: { dform, Dialog },
  mixins: [global],
  data: () => ({
    title: "Banner",
    headers: [
      { text: "Title", value: "title", align: "left" },
      { text: "Small Title", value: "small_title", align: "left" },
      { text: "Image", value: "url", align: "center" },
      { text: "", value: "", align: "center", sortable: false }
    ],
    items: [],
    showForm: false,
    isEdit: false,
    dataToEdit: {}
  }),

  watch: {
    pagination: {
      handler: debounce(function() {
        this.pupulateTable();
      }, 500),
      deep: true
    }
  },

  mounted() {
    this.pupulateTable();
  },

  methods: {
    async pupulateTable() {
      try {
        this.activateLoader();
        this.loading = true;
        const { descending, sortBy } = this.pagination;
        const endPoint = `${BANNER_URL}?${this.getQueryParams()}`;
        const res = await axios.get(endPoint).then(res => res.data);
        this.items = res.data;
        this.totalItems = res.meta.total;
        if (this.pagination.sortBy) {
          this.items = this.items.sort((a, b) => {
            const sortA = a[sortBy];
            const sortB = b[sortBy];

            if (descending) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        }
        this.loading = false;
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();

        catchError(e);
      }
    },
    onClose() {
      this.showForm = false;
      this.isEdit = false;
      this.dataToEdit = {};
      this.showDialog = false;
    },
    addData(data) {
      this.items.unshift(data);
      this.onClose();
    },
    toDetail(data) {
      this.isEdit = true;
      this.dataToEdit = data;
      this.showForm = true;
    },
    editData(data) {
      const index = findIndex(this.items, item => {
        return item.id === data.id;
      });
      if (index !== -1) {
        this.items.splice(index, 1, data);
      }
      this.onClose();
    },
    showConfirm(data) {
      this.showDialog = true;
      this.dataToEdit = data;
    },
    removeData() {
      try {
        this.activateLoader();
        axios.delete(BANNER_URL + "/" + this.dataToEdit.id).then(resp => {
          if (resp.status === 200) {
            let index = findIndex(
              this.items,
              item => item.id == this.dataToEdit.id
            );
            this.items.splice(index, 1);
            showNoty("Data deleted", "success");
            this.onClose();
          }
        });
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    }
  }
};
</script>
