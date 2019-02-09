"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductAttributeSchema extends Schema {
  up() {
    this.create("product_attributes", table => {
      table.increments();
      table.uuid("product_id");
      table.string("name", 50);
      table.string("value");
      table.timestamps();
    });
  }

  down() {
    this.drop("product_attributes");
  }
}

module.exports = ProductAttributeSchema;
