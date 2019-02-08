"use strict";

const { ResponseParser } = use("App/Helpers");
const User = use("App/Models/User");

class AuthController {
  async login({ request, response, auth }) {
    try {
      const { email, password } = request.post();
      const user = await User.findBy("email", email);
      if (!user) {
        return response.status(401).send(ResponseParser.unauthorizedResponse());
      }
      await user.tokens().delete();
      const authData = await auth
        .authenticator("jwt")
        .withRefreshToken()
        .attempt(email, password);
      return response
        .status(200)
        .send(ResponseParser.successResponse(authData, "Login success"));
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
