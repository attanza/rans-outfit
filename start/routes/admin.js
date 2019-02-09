const Route = use("Route");

Route.get("/admin/login", "Admin/AuthController.login").middleware("guest");

Route.group(() => {
  Route.get("/", "DashboardController.index");

  Route.resource("products", "ProductController");
})
  .middleware("auth")
  .prefix("admin")
  .namespace("Admin");
