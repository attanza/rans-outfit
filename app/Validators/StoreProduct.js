"use strict";

const { ResponseParser } = use("App/Helpers");
const messages = require("./messages");

class StoreProduct {
  get rules() {
    return {
      name: "required|max:100|unique:products",
      product_category_id: "required|integer",
      code: "string|max:20",
      regular_price: "required|integer",
      sell_price: "integer",
      discount: "integer",
      tax: "integer",
      stock: "integer",
      ordering: "integer",
      tags: "string",
      is_featured: "boolean",
      is_publish: "boolean"
    };
  }

  get messages() {
    return messages;
  }

  get sanitizationRules() {
    return {
      name: "trim|escape",
      product_category_id: "toInt",
      code: "trim|escape",
      regular_price: "toInt",
      sell_price: "toInt",
      discount: "toInt",
      tax: "toInt",
      stock: "toInt",
      ordering: "toInt",
      tags: "toInt",
      is_featured: "toBoolean",
      is_publish: "toBoolean"
    };
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages));
  }
}

module.exports = StoreProduct;
