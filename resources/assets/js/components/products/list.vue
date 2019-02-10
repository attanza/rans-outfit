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
        <v-text-field v-model="search" append-icon="search" label="Cari" single-line hide-details/>
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
            <a @click="toDetail(props.item)">{{ props.item.code }}</a>
          </td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.stock }}</td>
          <td>{{ props.item.regular_price }}</td>
          <td>{{ props.item.sell_price }}</td>
          <td>
            <v-checkbox :input-value="props.item.is_publish" hide-details color="primary"/>
          </td>
          <td>
            <v-checkbox :input-value="props.item.is_featured" hide-details color="primary"/>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
  </div>
</template>
<script>
import _ from "lodash";
import { PRODUCT_URL } from "../../utils/apis";
import { global } from "../../mixins";
import dform from "./dform";
import axios from "axios";
import catchError from "../../utils/catchError";

export default {
  components: { dform },
  mixins: [global],
  data: () => ({
    title: "Products",
    headers: [
      { text: "Code", align: "left", value: "code" },
      { text: "Name", value: "name", align: "left" },
      { text: "Stock", value: "category", align: "left" },
      { text: "Regular Price", value: "regular_price", align: "left" },
      { text: "Sell Price", value: "sell_price", align: "left" },
      { text: "Publish", value: "is_publish", align: "left" },
      { text: "Featured", value: "is_featured", align: "left" }
    ],
    items: [],
    showForm: true
  }),

  watch: {
    pagination: {
      handler() {
        this.pupulateTable();
      },
      deep: true
    }
  },

  mounted() {
    this.pupulateTable();
  },

  methods: {
    searchQuery: _.debounce(function() {
      this.pupulateTable();
    }, 500),
    async pupulateTable() {
      try {
        this.activateLoader();
        this.loading = true;
        const { page, rowsPerPage, descending, sortBy } = this.pagination;
        const endPoint = `${PRODUCT_URL}?page=${page}&limit=${rowsPerPage}&search=${
          this.search
        }`;
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
    toDetail(data) {
      this.$router.push(`/universities/${data.id}`);
    },
    addData(data) {
      this.items.unshift(data);
      this.showForm = false;
    },
    downloadData() {
      this.dataToExport = [];
      this.dataToExport = this.items;
      if (this.dataToExport.length) {
        this.showDownloadDialog = true;
      }
    }
  }
};
</script>
