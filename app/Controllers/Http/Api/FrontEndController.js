"use strict";

const Product = use("App/Models/Product");
const Banner = use("App/Models/Banner");
const { RedisHelper, ErrorLog, ResponseParser } = use("App/Helpers");
class FrontEndController {
  async getFeaturedProducts({ response }) {
    const redisKey = "Product_Featured";
    const cache = await RedisHelper.get(redisKey);
    if (cache) {
      return cache;
    }
    const products = await Product.query()
      .with("medias", builder => {
        builder.limit(1);
        builder.where("is_publish", 1);
        builder.where("is_main", 1);
        builder.fetch();
      })
      .where(function(builder) {
        this.whereHas("medias");
        this.where("is_publish", 1);
        this.where("is_featured", 1);
        this.where("stock_status_id", 1);
      })
      .limit(12)
      .fetch();
    await RedisHelper.set(redisKey, products.toJSON());
    return response.status(200).send(products.toJSON());
  }

  async getProducts({ request, response }) {
    try {
      let {
        page,
        limit,
        search,
        search_by,
        search_query,
        between_date,
        start_date,
        end_date,
        sort_by,
        sort_mode,
        category
      } = request.get();

      if (!page) page = 1;
      if (!limit) limit = 12;
      if (!sort_by) sort_by = "created_at";
      if (!sort_mode) sort_mode = "desc";

      const redisKey = `Product_${page || ""}${limit || ""}${sort_by ||
        ""}${sort_mode || ""}${search_by || ""}${search_query ||
        ""}${between_date || ""}${start_date || ""}${end_date ||
        ""}${category || ""}`;

      let cached = await RedisHelper.get(redisKey);

      if (cached && !search) {
        return cached;
      }
      const data = await Product.query()
        .has("medias")
        .with("medias", builder => {
          builder.where("is_publish", 1);
        })
        .where(function() {
          this.where("is_publish", 1);
          if (search && search != "") {
            this.where("name", "like", `%${search}%`);
            this.orWhere("value", "like", `%${search}%`);
          }

          if (category && category != "") {
            this.whereHas("category", builder => {
              builder.where("slug", category);
            });
          }

          if (!category || category === "") {
            this.where("is_featured", 1);
          }

          if (search_by && search_query) {
            this.where(search_by, search_query);
          }

          if (between_date && start_date && end_date) {
            this.whereBetween(between_date, [start_date, end_date]);
          }
        })
        .orderBy(sort_by, sort_mode)
        .paginate(page, limit);

      let parsed = ResponseParser.apiCollection(data.toJSON());
      if (!search || search == "") {
        await RedisHelper.set(redisKey, parsed);
      }
      return response.status(200).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  async getSliders({ response }) {
    const redisKey = "Banner_Front";
    const cache = await RedisHelper.get(redisKey);
    if (cache) {
      return cache;
    }
    const products = await Banner.all();
    await RedisHelper.set(redisKey, products.toJSON());
    return response.status(200).send(products.toJSON());
  }
}

module.exports = FrontEndController;
