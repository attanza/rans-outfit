"use strict";

const Role = use("App/Models/Role");

const roles = ["Administrator"];

class RoleSeeder {
  async run() {
    await Role.truncate();

    for (let i = 0; i < roles.length; i++) {
      await Role.create({
        name: roles[i]
      });
    }
  }
}

module.exports = RoleSeeder;
