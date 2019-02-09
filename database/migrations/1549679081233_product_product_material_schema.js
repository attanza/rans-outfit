"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductProductMaterialSchema extends Schema {
  up() {
    this.create("product_product_material", table => {
      table.increments();
      table.uuid("product_id");
      table.integer("product_material_id");
      table.timestamps();
    });
  }

  down() {
    this.drop("product_product_material");
  }
}

module.exports = ProductProductMaterialSchema;
