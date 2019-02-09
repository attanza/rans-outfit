"use strict";

class AuthController {
  async login({ view }) {
    return view.render("auth.adminLogin");
  }
}

module.exports = AuthController;
