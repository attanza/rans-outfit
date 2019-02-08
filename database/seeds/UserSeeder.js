"use strict";

const User = use("App/Models/User");
const changeCase = require("change-case");
const Database = use("Database");
const roles = ["Administrator"];

class UserSeeder {
  async run() {
    await Database.table("users").truncate();
    await Database.table("tokens").truncate();
    await Database.table("role_user").truncate();

    for (let i = 0; i < roles.length; i++) {
      let userData = {
        name: roles[i],
        email: changeCase.snakeCase(roles[i]) + "@ransoutfit.com",
        password: "password",
        is_active: 1
      };
      await User.create(userData);
    }
  }
}

module.exports = UserSeeder;
