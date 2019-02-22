"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProductCategory extends Model {
  static boot() {
    super.boot();

    this.addTrait("@provider:Lucid/Slugify", {
      fields: { slug: "name" },
      strategy: "dbIncrement",
      disableUpdates: false
    });
  }

  products() {
    return this.hasMany("App/Models/Product");
  }
}

module.exports = ProductCategory;
