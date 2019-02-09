"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductSchema extends Schema {
  up() {
    this.create("products", table => {
      table.uuid("id").primary();
      table.integer("product_category_id");
      table.string("code", 20);
      table
        .string("name", 100)
        .unique()
        .index();
      table
        .string("slug", 150)
        .unique()
        .index();
      table.integer("regular_price");
      table.integer("sell_price");
      table.integer("discount");
      table.integer("tax");
      table.integer("stock");
      table.integer("stock_status_id").default(1);
      table.integer("ordering");
      table.text("tags");
      table.timestamp("deleted_at").nullable();
      table.boolean("is_featured").default(false);
      table.boolean("is_publish").default(true);
      table.timestamps();
    });
  }

  down() {
    this.drop("products");
  }
}

module.exports = ProductSchema;
