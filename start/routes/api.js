const Route = use("Route");

Route.group(() => {
  Route.post("login", "AuthController.login");
  Route.post("logout", "AuthController.logout");
  Route.get("me", "AuthController.me");

  Route.get("combo-data", "ComboDataController.index");

  Route.resource("products", "ProductController")
    .apiOnly()
    .validator(
      new Map([
        [["products.store"], ["StoreProduct"]],
        [["products.update"], ["UpdateProduct"]]
      ])
    );
})
  .prefix("api/v1")
  .namespace("Api");
