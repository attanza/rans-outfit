"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId();

class Product extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
        userInstance.id = await uid.randomUUID(24);
      }
    });
    this.addTrait("@provider:Lucid/Slugify", {
      fields: {
        slug: "name"
      },
      strategy: "dbIncrement",
      disableUpdates: false
    });
  }

  stockStatus() {
    return this.belongsTo("App/Models/StockStatus");
  }

  descriptions() {
    return this.hasMany("App/Models/ProductDescription");
  }

  category() {
    return this.belongsTo("App/Models/ProductCategory");
  }

  shipping() {
    return this.belongsTo("App/Models/ProductShipping");
  }

  attributes() {
    return this.hasMany("App/Models/ProductAttribute");
  }

  materials() {
    return this.belongsToMany("App/Models/ProductMaterial");
  }
}

module.exports = Product;
