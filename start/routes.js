"use strict";

const Route = use("Route");

Route.get("/", "HomeController.index");

Route.group(() => {
  Route.post("login", "AuthController.login");
})
  .prefix("api/v1")
  .namespace("Api");

Route.group(() => {
  Route.get("me", "AuthController.me");
})
  .middleware(["auth:jwt"])
  .prefix("api/v1")
  .namespace("Api");
