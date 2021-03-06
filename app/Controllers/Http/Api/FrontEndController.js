"use strict";

const Product = use("App/Models/Product");
const { RedisHelper } = use("App/Helpers");

class FrontEndController {
  async getFeaturedProducts({ response }) {
    const redisKey = "Product_Featured";
    const cache = await RedisHelper.get(redisKey);
    if (cache) {
      console.log("from cache");
      return cache;
    }
    const products = await Product.query()
      .with("medias", builder => {
        builder.limit(1);
        builder.where("is_publish", 1);
        builder.where("is_main", 1);
        builder.fetch();
      })
      .where("is_publish", 1)
      .where("is_featured", 1)
      .where("stock_status_id", 1)
      .limit(12)
      .fetch();
    await RedisHelper.set(redisKey, products.toJSON());
    return response.status(200).send(products.toJSON());
  }
}

module.exports = FrontEndController;
