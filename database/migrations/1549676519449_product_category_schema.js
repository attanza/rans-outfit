"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductCategorySchema extends Schema {
  up() {
    this.create("product_categories", table => {
      table.increments();
      table.string("name", 50).index();
      table.string("slug", 100).index();
      table.integer("parent_id");
      table.string("description");
      table.timestamps();
    });
  }

  down() {
    this.drop("product_categories");
  }
}

module.exports = ProductCategorySchema;
