"use strict";

const { ResponseParser } = use("App/Helpers");

class AuthController {
  async login({ request, response, auth }) {
    try {
      const { email, password } = request.post();

      await auth.attempt(email, password);

      return response
        .status(200)
        .send(ResponseParser.successResponse(true, "Login success"));
    } catch (e) {
      return response.status(401).send(ResponseParser.unauthorizedResponse());
    }
  }

  async logout({ response, auth }) {
    try {
      await auth.logout();

      return response
        .status(200)
        .send(ResponseParser.successResponse(true, "Logout success"));
    } catch (e) {
      console.log("e", e);

      return response.status(401).send(ResponseParser.unauthorizedResponse());
    }
  }

  async me({ response, auth }) {
    const user = await auth.getUser();
    return response.status(200).send(ResponseParser.apiItem(user));
  }
}

module.exports = AuthController;
