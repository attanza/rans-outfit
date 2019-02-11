"use strict";

const Product = use("App/Models/Product");

class ProductSeeder {
  async run() {
    await Product.truncate();
    await Product.create({
      product_category_id: 1,
      code: "18-11-07",
      name: "Ghania Kimono",
      regular_price: 145000,
      sell_price: 123250,
      discount: 3,
      tax: 10,
      stock: 10,
      stock_status_id: 1,
      ordering: 1,
      material: "Katun Ima",
      is_featured: 1,
      is_publish: 1
    });
  }
}

module.exports = ProductSeeder;
