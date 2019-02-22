"use strict";

const ProductCategory = use("App/Models/ProductCategory");
const { ResponseParser, ErrorLog, RedisHelper } = use("App/Helpers");
const fillable = ["name", "description"];

class ProductCategoryCategoryController {
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

      const redisKey = `ProductCategory_${page || ""}${limit || ""}${sort_by ||
        ""}${sort_mode || ""}${search_by || ""}${search_query ||
        ""}${between_date || ""}${start_date || ""}${end_date || ""}`;

      let cached = await RedisHelper.get(redisKey);

      if (cached && !search) {
        return cached;
      }
      const data = await ProductCategory.query()
        .where(function() {
          if (search && search != "") {
            this.where("name", "like", `%${search}%`);
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
   * Store New ProductCategory
   */

  async store({ request, response }) {
    try {
      let body = request.only(fillable);
      const data = await ProductCategory.create(body);
      let parsed = ResponseParser.apiCreated(data.toJSON());
      await RedisHelper.delete("ProductCategory_*");
      await RedisHelper.delete("Product_*");
      await RedisHelper.delete("ComboData_*");
      return response.status(201).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  /**
   * Update
   * Update ProductCategory by Id
   */
  async update({ request, response }) {
    try {
      let body = request.only(fillable);
      const id = request.params.id;
      const data = await ProductCategory.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      await data.merge(body);
      await data.save();
      await RedisHelper.delete("ProductCategory_*");
      await RedisHelper.delete("Product_*");
      await RedisHelper.delete("ComboData_*");
      let parsed = ResponseParser.apiUpdated(data.toJSON());
      return response.status(200).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  /**
   * Delete
   * Delete ProductCategorty by Id
   */
  async destroy({ request, response }) {
    try {
      const id = request.params.id;
      const data = await ProductCategory.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      await RedisHelper.delete("ProductCategory_*");
      await RedisHelper.delete("Product_*");
      await RedisHelper.delete("ComboData_*");
      await data.delete();
      return response.status(200).send(ResponseParser.apiDeleted());
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }
}
/**
 * Index
 * Get List of Universities
 */
module.exports = ProductCategoryCategoryController;
