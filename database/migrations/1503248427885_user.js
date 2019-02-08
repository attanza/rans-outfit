"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.uuid("id").primary();
      table.string("name", 80).notNullable();
      table.string("email", 200).notNullable();
      table.string("password", 60).notNullable();
      table.string("avatar").nullable();
      table.boolean("is_active").default(0);
      table.timestamp("deleted_at").nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
