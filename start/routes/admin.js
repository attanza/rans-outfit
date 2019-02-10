const Route = use("Route");
const { RedisHelper } = use("App/Helpers");

Route.get("/admin/login", "Admin/AuthController.login").middleware("guest");

Route.group(() => {
  Route.get("/", "DashboardController.index");
  Route.get("/redis-clear", async ({ response }) => {
    await RedisHelper.clear();
    return response.redirect("/admin");
  });

  Route.resource("products", "ProductController");
})
  .middleware("auth")
  .prefix("admin")
  .namespace("Admin");
