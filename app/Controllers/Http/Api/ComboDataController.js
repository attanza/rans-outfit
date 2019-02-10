"use strict";
const { InArray, ResponseParser, ErrorLog, RedisHelper } = use("App/Helpers");

const allowedResources = ["StockStatus", "ProductCategory"];

class ComboDataController {
  async index({ request, response }) {
    try {
      let { resource, sort_by, sort_mode } = request.get();
      if (!sort_by) sort_by = "id";
      if (!sort_mode) sort_mode = "asc";

      const redisKey = `ComboData_${resource}${sort_by ? sort_by : ""}${
        sort_mode ? sort_mode : ""
      }`;
      const cached = await RedisHelper.get(redisKey);
      if (cached) {
        return response.status(200).send(cached);
      }

      if (!InArray(allowedResources, resource)) {
        return response
          .status(400)
          .send(ResponseParser.errorResponse("resource not allowed"));
      }
      const models = use("App/Models/" + resource);
      const data = await models
        .query()
        .orderBy(sort_by, sort_mode)
        .fetch();
      const parsed = ResponseParser.apiItem(data);
      await RedisHelper.set(redisKey, parsed);
      return response.status(200).send(parsed);
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }
}

module.exports = ComboDataController;
