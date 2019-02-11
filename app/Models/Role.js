"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Role extends Model {
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

  permissions() {
    return this.belongsToMany("App/Models/Permission");
  }
}

module.exports = Role;
