"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BannerSchema extends Schema {
  up() {
    this.create("banners", table => {
      table.increments();
      table.string("url");
      table.string("title");
      table.string("small_title");
      table.text("description");
      table.boolean("is_publish").default(0);
      table.date("start_date");
      table.date("end_date");
      table.timestamps();
    });
  }

  down() {
    this.drop("banners");
  }
}

module.exports = BannerSchema;
