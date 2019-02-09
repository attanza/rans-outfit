"use strict";
const { InArray, ResponseParser, ErrorLog } = use("App/Helpers");

const allowedResources = ["StockStatus"];

class ComboDataController {
  async index({ request, response }) {
    try {
      const { resource } = request.get();
      console.log("resource", resource);

      if (!InArray(allowedResources, resource)) {
        return response
          .status(400)
          .send(ResponseParser.errorResponse("resource not allowed"));
      }
      const models = use("App/Models/" + resource);
      const data = await models.all();
      return response.status(200).send(ResponseParser.apiItem(data));
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }
}

module.exports = ComboDataController;
