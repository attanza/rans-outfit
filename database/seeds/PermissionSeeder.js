"use strict";

const Permission = use("App/Models/Permission");

const resources = [
  "User",
  "Role",
  "Permission",
  "ErrorLog",
  "Product",
  "Product Media",
  "Stock Status",
  "Product Description",
  "Product Category",
  "Product Shipping",
  "Product Attribute",
  "Product Material",
  "Banner"
];
const actions = ["Read", "Create", "Update", "Delete"];

class PermissionSeeder {
  async run() {
    await Permission.truncate();
    for (let i = 0; i < resources.length; i++) {
      for (let j = 0; j < actions.length; j++) {
        await Permission.create({ name: actions[j] + " " + resources[i] });
      }
    }
  }
}

module.exports = PermissionSeeder;
