"use strict";

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId();
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class User extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeCreate", ["User.generateUid", "hashPassword"]);
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
