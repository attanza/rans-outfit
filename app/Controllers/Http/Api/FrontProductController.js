"use strict";

const Product = use("App/Models/Product");
class ProductController {
  async getProducts({ response }) {
    const products = await Product.query()
      .limit(9)
      .fetch();
    return response.status(200).send(products.toJSON());
  }
}

module.exports = ProductController;
