"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const { GetBaseUrl } = use("App/Helpers");

class Banner extends Model {
  static get dates() {
    return super.dates.concat(["start_date", "end_date"]);
  }
  getUrl() {
    if (this.url) {
      const splitUrl = this.url.split(":");
      if (splitUrl && (splitUrl[0] === "http" || splitUrl[0] === "https")) {
        return this.url;
      }
      console.log(GetBaseUrl());
      return `${GetBaseUrl()}/${this.url}`;
    } else return "";
  }
}

module.exports = Banner;
