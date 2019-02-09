"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductMaterialSchema extends Schema {
  up() {
    this.create("product_materials", table => {
      table.increments();
      table.string("name");
      table.string("description");
      table.timestamps();
    });
  }

  down() {
    this.drop("product_materials");
  }
}

module.exports = ProductMaterialSchema;
