"use strict";

const Helpers = use("Helpers");
const { ResponseParser, ErrorLog, RedisHelper } = use("App/Helpers");
const ProductMedia = use("App/Models/ProductMedia");
const fillable = [
  "product_id",
  "caption",
  "is_main",
  "is_publish",
  "type",
  "url"
];

class ProductMediaController {
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

      const redisKey = `ProductMedia_${page || ""}${limit || ""}${sort_by ||
        ""}${sort_mode || ""}${search_by || ""}${search_query ||
        ""}${between_date || ""}${start_date || ""}${end_date ||
        ""}${product_id || ""}`;

      let cached = await RedisHelper.get(redisKey);

      if (cached && !search) {
        return cached;
      }
      const data = await ProductMedia.query()
        .with("stockStatus")
        .where(function() {
          if (search && search != "") {
            this.where("type", "like", `%${search}%`);
            this.orWhere("caption", "like", `%${search}%`);
          }

          if (product_id) {
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
  async store({ request, response }) {
    try {
      const body = request.only(fillable);
      const media = await ProductMedia.create(body);
      if (request.file("file")) {
        const photo = request.file("file", {
          types: ["image"],
          size: "5mb"
        });
        if (!photo) {
          return response
            .status(400)
            .send(ResponseParser.errorResponse("Photo is not an image file"));
        }
        const name = `${new Date().getTime()}.${photo.subtype}`;
        await photo.move(Helpers.publicPath("img/products"), { name });
        if (!photo.moved()) {
          return response
            .status(400)
            .send(ResponseParser.errorResponse("Photo failed to upload"));
        }
        media.merge({ url: "img/products/" + name });
        await media.save();
      }

      await RedisHelper.delete("ProductMedia_*");
      let parsed = ResponseParser.apiCreated(media.toJSON());
      return response.status(200).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }
}

module.exports = ProductMediaController;
