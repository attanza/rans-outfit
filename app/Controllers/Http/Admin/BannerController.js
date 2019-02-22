"use strict";

class BannerController {
  async index({ view }) {
    return view.render("banner.index");
  }
}

module.exports = BannerController;
