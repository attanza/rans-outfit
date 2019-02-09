"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductMediaSchema extends Schema {
  up() {
    this.create("product_medias", table => {
      table.increments();
      table.uuid("product_id");
      table.string("name", 100);
      table.string("type", 20);
      table.string("caption", 100);
      table.string("description");
      table.timestamps();
    });
  }

  down() {
    this.drop("product_medias");
  }
}

module.exports = ProductMediaSchema;
