"use strict";

const Banner = use("App/Models/Banner");
const { ResponseParser, ErrorLog, RedisHelper } = use("App/Helpers");
const Helpers = use("Helpers");
const Drive = use("Drive");
const fillable = [
  "title",
  "small_title",
  "description",
  "is_publish",
  "start_date",
  "end_date"
];

class BannerController {
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
      if (!sort_by) sort_by = "created_at";
      if (!sort_mode) sort_mode = "desc";

      const redisKey = `Banner_${page || ""}${limit || ""}${sort_by ||
        ""}${sort_mode || ""}${search_by || ""}${search_query ||
        ""}${between_date || ""}${start_date || ""}${end_date || ""}`;

      let cached = await RedisHelper.get(redisKey);

      if (cached && !search) {
        return cached;
      }
      const data = await Banner.query()
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
   * Store New Banner
   */

  async store({ request, response }) {
    try {
      let body = request.only(fillable);
      const data = await Banner.create(body);

      if (request.file("file")) {
        const photo = request.file("file", {
          types: ["image"],
          size: "5mb"
        });
        if (!photo) {
          return response
            .status(400)
            .send(ResponseParser.errorResponse("file is not an image"));
        }
        const name = `${new Date().getTime()}.${photo.subtype}`;
        await photo.move(Helpers.publicPath("images/banners"), { name });
        if (!photo.moved()) {
          return response
            .status(400)
            .send(ResponseParser.errorResponse("Banner failed to upload"));
        }
        data.merge({ url: "images/banners/" + name });
        await data.save();
      }

      let parsed = ResponseParser.apiCreated(data.toJSON());
      await RedisHelper.delete("Banner_*");
      return response.status(201).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  /**
   * Update
   * Update Banner by Id
   */
  async update({ request, response }) {
    try {
      let body = request.only(fillable);
      const id = request.params.id;
      const data = await Banner.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      await data.merge(body);
      await data.save();
      await RedisHelper.delete("Banner_*");
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
      const data = await Banner.find(id);
      if (!data) {
        return response.status(400).send(ResponseParser.apiNotFound());
      }
      await this.deleteFile(data.url);
      await RedisHelper.delete("Banner_*");
      await data.delete();
      return response.status(200).send(ResponseParser.apiDeleted());
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  async deleteFile(file) {
    try {
      const fileLocation = Helpers.publicPath(file);
      const exists = await Drive.exists(fileLocation);
      if (exists) {
        await Drive.delete(fileLocation);
      }
    } catch (e) {
      throw e;
    }
  }
}
module.exports = BannerController;
