"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductDescriptionSchema extends Schema {
  up() {
    this.create("product_descriptions", table => {
      table.increments();
      table.uuid("product_id");
      table.text("short_description");
      table.text("long_description");
      table.timestamps();
    });
  }

  down() {
    this.drop("product_descriptions");
  }
}

module.exports = ProductDescriptionSchema;
