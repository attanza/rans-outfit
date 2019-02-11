"use strict";

const { ResponseParser } = use("App/Helpers");
const messages = require("./messages");

class StoreProductMedia {
  get rules() {
    return {
      product_id: "required|string",
      type: "string|max:20|in:image,video",
      caption: "string|max:100",
      is_main: "boolean",
      is_publish: "boolean",
      url: "required_if:!file|url",
      file: "required_if:!url"
    };
  }

  get sanitizationRules() {
    return {
      is_main: "toBoolean",
      is_publish: "toBoolean",
      caption: "trim|escape"
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

module.exports = StoreProductMedia;
