"use strict";

const Route = use("Route");

Route.get("/", "HomeController.index");
Route.get("/:category", "HomeController.index");

Route.resource("products", "Api/ProductController")
  .apiOnly()
  .validator(
    new Map([
      [["products.store"], ["StoreProduct"]],
      [["products.update"], ["UpdateProduct"]]
    ])
  );

require("./routes/admin");
require("./routes/api");
