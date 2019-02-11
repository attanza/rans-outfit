<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Create Product</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e1 > 2" step="2">Descriptions</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">Attributes</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <productForm @onSaveProduct="e1 = 2"/>
      </v-stepper-content>

      <v-stepper-content step="2">
        <description @onSaveDescription="e1 = 3"/>
      </v-stepper-content>

      <v-stepper-content step="3">
        <attributes @onSaveAttribute="toList"/>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import productForm from "./productForm";
import description from "./description";
import attributes from "./attributes";

export default {
  components: { productForm, description, attributes },
  data() {
    return {
      e1: 0
    };
  },
  methods: {
    toList() {
      window.location.replace("/admin/products");
    }
  }
};
</script>