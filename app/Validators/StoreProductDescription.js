"use strict";

const { ResponseParser } = use("App/Helpers");
const messages = require("./messages");

class StoreProductDescription {
  get rules() {
    return {
      product_id: "required|string",
      short_description: "string",
      long_description: "string"
    };
  }

  get messages() {
    return messages;
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages));
  }
}

module.exports = StoreProductDescription;
