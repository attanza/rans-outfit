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
            <a @click="toDetail(props.item)">{{ props.item.name }}</a>
          </td>
          <td>{{ props.item.description }}</td>
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
  </div>
</template>
<script>
import { PRODUCT_CATEGORY_URL } from "../../utils/apis";
import { global } from "../../mixins";
import dform from "./dform";
import catchError from "../../utils/catchError";
import debounce from "lodash/debounce";
import findIndex from "lodash/findIndex";
export default {
  components: { dform },
  mixins: [global],
  data: () => ({
    title: "Product Category",
    headers: [
      { text: "Name", value: "name", align: "left" },
      { text: "Description", value: "description", align: "left" }
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
        const endPoint = `${PRODUCT_CATEGORY_URL}?${this.getQueryParams()}`;
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
    }
  }
};
</script>
