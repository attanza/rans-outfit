"use strict";

const { ResponseParser } = use("App/Helpers");
const messages = require("./messages");

class UpdateBanner {
  get rules() {
    return {
      title: "required|string|max:50",
      small_title: "required|string|max:50",
      is_publish: "boolean",
      start_date: "date",
      end_date: "date",
      description: "string|max:250"
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

module.exports = UpdateBanner;
