"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductShippingSchema extends Schema {
  up() {
    this.create("product_shippings", table => {
      table.increments();
      table.uuid("product_id");
      table.integer("weight");
      table.integer("length");
      table.integer("width");
      table.integer("height");
      table.timestamps();
    });
  }

  down() {
    this.drop("product_shippings");
  }
}

module.exports = ProductShippingSchema;
