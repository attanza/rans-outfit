"use strict";

const Env = use("Env");

module.exports = () => {
  let environment = Env.get("NODE_ENV");
  if (environment === "production") {
    return Env.get("PRODUCTION_URL");
  } else {
    return Env.get("APP_URL");
  }
};
