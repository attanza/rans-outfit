"use strict";

const { ResponseParser } = use("App/Helpers");
const messages = require("./messages");

class StoreBanner {
  get rules() {
    return {
      title: "required|string|max:50",
      small_title: "required|string|max:50",
      file: "required",
      is_publish: "boolean",
      start_date: "date",
      end_date: "date",
      description: "string|max:300"
    };
  }

  get messages() {
    return messages;
  }

  get sanitizationRules() {
    return {
      title: "trim|escape",
      small_title: "trim|escape",
      description: "trim|escape"
    };
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages));
  }
}

module.exports = StoreBanner;
