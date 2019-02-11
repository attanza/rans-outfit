"use strict";

const ProductAttribute = use("App/Models/ProductAttribute");

class ProductAttributeSeeder {
  async run() {
    await ProductAttribute.truncate();
  }
}

module.exports = ProductAttributeSeeder;
