"use strict";

const { ResponseParser, ErrorLog } = use("App/Helpers");

class AuthController {
  async login({ request, response, auth }) {
    try {
      const { email, password } = request.post();

      await auth.attempt(email, password);

      return response
        .status(200)
        .send(ResponseParser.successResponse(true, "Login success"));
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  async logout({ response, auth }) {
    try {
      await auth.logout();

      return response
        .status(200)
        .send(ResponseParser.successResponse(true, "Logout success"));
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }

  async me({ response, auth }) {
    try {
      const user = await auth.getUser();
      return response.status(200).send(ResponseParser.apiItem(user));
    } catch (e) {
      ErrorLog(request, e);
      return response.status(500).send(ResponseParser.unknownError());
    }
  }
}

module.exports = AuthController;
