"use strict";

const User = use("App/Models/User");
const changeCase = require("change-case");
const Database = use("Database");
const roles = ["Administrator"];

class UserSeeder {
  async run() {
    await Database.table("users").truncate();
    await Database.table("tokens").truncate();
    for (let i = 0; i < roles.length; i++) {
      let userData = {
        name: roles[i],
        email: changeCase.snakeCase(roles[i]) + "@ransoutfit.com",
        password: "password",
        is_active: 1
      };
      await User.create(userData);
    }

    const user = await User.first();
    user.roles().attach([1]);
  }
}

module.exports = UserSeeder;
