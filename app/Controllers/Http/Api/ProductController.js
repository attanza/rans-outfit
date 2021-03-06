"use strict";

const Product = use("App/Models/Product");
const { ResponseParser, ErrorLog, RedisHelper } = use("App/Helpers");
const fillable = [
  "name",
  "product_category_id",
  "code",
  "regular_price",
  "sell_price",
  "discount",
  "tax",
  "stock",
  "ordering",
  "tags",
  "is_featured",
  "is_publish",
  "material"
];

class ProductController {
  /**
   * Index
   * Get List of Universities
   */
  async index({ request, response }) {
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
        sort_mode
      } = request.get();

      if (!page) page = 1;
      if (!limit) limit = 10;
      if (!sort_by) sort_by = "id";
      if (!sort_mode) sort_mode = "desc";

      const redisKey = `Product_${page || ""}${limit || ""}${sort_by ||
        ""}${sort_mode || ""}${search_by || ""}${search_query ||
        ""}${between_date || ""}${start_date || ""}${end_date || ""}`;

      let cached = await RedisHelper.get(redisKey);

      if (cached && !search) {
        return cached;
      }
      const data = await Product.query()
        .with("stockStatus")
        .where(function() {
          if (search && search != "") {
            this.where("name", "like", `%${search}%`);
            this.orWhere("code", "like", `%${search}%`);
            this.orWhere("stock", "like", `%${search}%`);
            this.orWhere("regular_price", "like", `%${search}%`);
            this.orWhere("sell_price", "like", `%${search}%`);
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

  /**
   * Store
   * Store New Products
   * Can only be done by Super Administrator
   */

  async store({ request, response }) {
    try {
      let body = request.only(fillable);
      const data = await Product.create(body);
      const { short_description, long_description } = request.post();
      if (short_description || long_description) {
        await data
          .description()
          .create({ short_description, long_description });
      }
      const { attributes } = request.post();
      if (attributes) {
        await data.attributes().createMany(attributes);
      }
      const { shipping } = request.post();
      if (shipping) {
        await data.shipping().create(shipping);
      }
      await RedisHelper.delete("Product_*");
      await data.load("stockStatus");
      let parsed = ResponseParser.apiCreated(data.toJSON());
      return response.status(201).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  /**
   * Show
   * Product by id
   */
  async show({ request, response }) {
    try {
      const id = request.params.id;
      let redisKey = `Product_${id}`;
      let cached = await RedisHelper.get(redisKey);
      if (cached) {
        return response.status(200).send(cached);
      }
      const data = await Product.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      let parsed = ResponseParser.apiItem(data.toJSON());
      await RedisHelper.set(redisKey, parsed);
      return response.status(200).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  /**
   * Update
   * Update Product by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response }) {
    try {
      let body = request.only(fillable);
      const id = request.params.id;
      const data = await Product.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      data.merge(body);
      await data.save();
      await RedisHelper.delete("Product_*");
      let parsed = ResponseParser.apiUpdated(data.toJSON());
      return response.status(200).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  /**
   * Delete
   * Delete Product by Id
   * Can only be done by Super Administrator
   * Default Product ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student'] cannot be deleted
   */
  async destroy({ request, response }) {
    try {
      const id = request.params.id;
      const data = await Product.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      await RedisHelper.delete("Product_*");
      await data.delete();
      return response.status(200).send(ResponseParser.apiDeleted());
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }
}

module.exports = ProductController;
