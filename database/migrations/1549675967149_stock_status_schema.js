"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StockStatusSchema extends Schema {
  up() {
    this.create("stock_statuses", table => {
      table.increments();
      table.string("name", 50);
      table.string("description");
      table.timestamps();
    });
  }

  down() {
    this.drop("stock_statuses");
  }
}

module.exports = StockStatusSchema;
