"use strict";

const { ResponseParser } = use("App/Helpers");
const messages = require("./messages");

class StoreProductAttribute {
  get rules() {
    const id = this.ctx.params.id;
    return {
      name: `required|string|max:50|unique:product_categories,name,id,${id}`,
      description: "string|max:250"
    };
  }

  get messages() {
    return messages;
  }

  get sanitizationRules() {
    return {
      name: "trim|escape",
      description: "trim|escape"
    };
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages));
  }
}

module.exports = StoreProductAttribute;
