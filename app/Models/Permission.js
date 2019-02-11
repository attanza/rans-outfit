"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Permission extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Lucid/Slugify", {
      fields: {
        slug: "name"
      },
      strategy: "dbIncrement",
      disableUpdates: true
    });
  }

  roles() {
    return this.belongsToMany("App/Models/Role");
  }
}

module.exports = Permission;
