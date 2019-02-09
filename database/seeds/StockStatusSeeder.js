"use strict";

const StockStatus = use("App/Models/StockStatus");

const status = ["In stock", "Out of stock", "In back order"];

class StockStatusSeeder {
  async run() {
    await StockStatus.truncate();
    for (let i = 0; i < status.length; i++) {
      await StockStatus.create({ name: status[i] });
    }
  }
}

module.exports = StockStatusSeeder;
