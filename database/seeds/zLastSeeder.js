"use strict";

const Permission = use("App/Models/Permission");
const Database = use("Database");
class LastSeeder {
  async run() {
    await Database.table("permission_role").truncate();

    let permissions = await Permission.all();
    permissions = permissions.toJSON();

    for (let i = 0; i < permissions.length; i++) {
      await Database.table("permission_role").insert({
        role_id: 1,
        permission_id: permissions[i].id
      });
    }
  }
}

module.exports = LastSeeder;
