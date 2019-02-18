"use strict";

const Product = use("App/Models/Product");
const { RedisHelper } = use("App/Helpers");

class HomeController {
  async index({ view }) {
    const redisKey = "Product_Featured";
    const cache = await RedisHelper.get(redisKey);
    if (cache) {
      return view.render("home.index", {
        products: cache
      });
    }
    const products = await Product.query()
      .with("medias", builder => {
        builder.where("is_publish", 1);
        builder.where("is_main", 1);
      })
      .where("is_publish", 1)
      .where("is_featured", 1)
      .where("stock_status_id", 1)
      .limit(12)
      .fetch();
    const parsed = products.toJSON();
    // await RedisHelper.set(redisKey, parsed);
    return view.render("home.index", {
      products: parsed
    });
  }
}

module.exports = HomeController;
