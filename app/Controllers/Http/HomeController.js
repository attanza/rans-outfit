"use strict";
class HomeController {
  async index({ request, view }) {
    let { category } = request.params;
    if (!category) category = "";
    return view.render("home.index", {
      category
    });
  }
}

module.exports = HomeController;
