"use strict";

const ProductAttribute = use("App/Models/ProductAttribute");

const { ResponseParser, ErrorLog, RedisHelper } = use("App/Helpers");
const fillable = ["product_id", "name", "value"];

class ProductAttributeController {
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
        sort_mode,
        product_id
      } = request.get();

      if (!page) page = 1;
      if (!limit) limit = 10;
      if (!sort_by) sort_by = "id";
      if (!sort_mode) sort_mode = "desc";

      const redisKey = `ProductAttribute_${page || ""}${limit || ""}${sort_by ||
        ""}${sort_mode || ""}${search_by || ""}${search_query ||
        ""}${between_date || ""}${start_date || ""}${end_date ||
        ""}${product_id || ""}`;

      let cached = await RedisHelper.get(redisKey);

      if (cached && !search) {
        return cached;
      }
      const data = await ProductAttribute.query()
        .with("product")
        .where(function() {
          if (search && search != "") {
            this.where("name", "like", `%${search}%`);
            this.orWhere("value", "like", `%${search}%`);
          }

          if (product_id && product_id != "") {
            this.where("product_id", product_id);
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
   * Store New ProductAttributes
   * Can only be done by Super Administrator
   */

  async store({ request, response }) {
    try {
      const { product_id, attributes } = request.post();
      let attribute;
      if (attributes && attributes.length) {
        for (let i = 0; i < attributes.length; i++) {
          attribute = await this.createAttribute({
            product_id,
            name: attributes[i].name,
            value: attributes[i].value
          });
        }
      } else {
        const body = request.only(fillable);
        attribute = await this.createAttribute(body);
      }

      await RedisHelper.delete("ProductAttribute_*");
      await RedisHelper.delete(`Product_${product_id}`);
      let parsed = ResponseParser.apiCreated(attribute);
      return response.status(201).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  async createAttribute(data) {
    return await ProductAttribute.create(data);
  }

  /**
   * Show
   * ProductAttribute by id
   */
  async show({ request, response }) {
    try {
      const id = request.params.id;
      let redisKey = `ProductAttribute_${id}`;
      let cached = await RedisHelper.get(redisKey);
      if (cached) {
        return response.status(200).send(cached);
      }
      const data = await ProductAttribute.find(id);
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
   * Update ProductAttribute by Id
   * Can only be done by Super Administrator
   */
  async update({ request, response }) {
    try {
      let body = request.only(fillable);
      const id = request.params.id;
      const data = await ProductAttribute.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      await data.merge(body);
      await data.save();
      await RedisHelper.delete("ProductAttribute_*");
      await RedisHelper.delete(`Product_${data.product_id}`);

      let parsed = ResponseParser.apiUpdated(data.toJSON());
      return response.status(200).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  /**
   * Delete
   * Delete ProductAttribute by Id
   * Can only be done by Super Administrator
   * Default ProductAttribute ['Super Administrator', 'Administrator', 'Supervisor', 'Marketing', 'Student'] cannot be deleted
   */
  async destroy({ request, response, auth }) {
    try {
      const id = request.params.id;
      const data = await ProductAttribute.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      await RedisHelper.delete("ProductAttribute_*");
      await RedisHelper.delete(`Product_${data.product_id}`);
      await data.delete();
      return response.status(200).send(ResponseParser.apiDeleted());
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }
}

module.exports = ProductAttributeController;
