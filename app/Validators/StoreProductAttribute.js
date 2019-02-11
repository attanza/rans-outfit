"use strict";

const { ResponseParser } = use("App/Helpers");
const messages = require("./messages");

class StoreProductAttribute {
  get rules() {
    return {
      product_id: "required|string",
      name: "required_if:!attributes|string|max:50",
      value: "required_if:!attributes|string|max:250",
      attributes: "array",
      "attributes.*.name": "required_if:attributes|string|max:50",
      "attributes.*.value": "required_if:attributes|string|max:250"
    };
  }

  get messages() {
    return messages;
  }

  get sanitizationRules() {
    return {
      name: "trim|escape",
      value: "trim|escape",
      "attributes.*.name": "trim|escape",
      "attributes.*.value": "trim|escape"
    };
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages));
  }
}

module.exports = StoreProductAttribute;
