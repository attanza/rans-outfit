"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Env = use("Env");

class ProductMedia extends Model {
  getUrl() {
    if (this.url) {
      const splitUrl = this.url.split(":");
      if (splitUrl && (splitUrl[0] === "http" || splitUrl[0] === "https")) {
        return this.url;
      }
      return `${getBaseUrl()}/${this.url}`;
    } else return "";
  }
}

module.exports = ProductMedia;

function getBaseUrl() {
  let environment = Env.get("NODE_ENV");
  if (environment === "production") {
    return Env.get("PRODUCTION_APP_URL");
  } else {
    return Env.get("APP_URL");
  }
}
