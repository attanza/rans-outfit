"use strict";

class ProductCategoryController {
  async index({ view }) {
    return view.render("productCategory.index");
  }
}

module.exports = ProductCategoryController;
