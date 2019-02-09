"use strict";

const ProductCategory = use("App/Models/ProductCategory");

const categories = ["Outer", "Blouse", "Pants"];

class ProductCategorySeeder {
  async run() {
    await ProductCategory.truncate();
    for (let i = 0; i < categories.length; i++) {
      await ProductCategory.create({ name: categories[i] });
    }
  }
}

module.exports = ProductCategorySeeder;
