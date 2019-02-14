"use strict";

const Model = use("Model");
const Hash = use("Hash");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId();

class User extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeCreate", async dbInstance => {
      dbInstance.id = await uid.randomUUID(24);
      dbInstance.password = await Hash.make(dbInstance.password);
    });
    this.addTrait("@provider:Lucid/SoftDeletes");
  }

  static get incrementing() {
    return false;
  }

  static get hidden() {
    return ["password"];
  }

  static get traits() {
    return [
      "@provider:Adonis/Acl/HasRole",
      "@provider:Adonis/Acl/HasPermission"
    ];
  }

  tokens() {
    return this.hasMany("App/Models/Token");
  }
}

module.exports = User;
