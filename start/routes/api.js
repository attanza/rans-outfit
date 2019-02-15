const Route = use("Route");

Route.group(() => {
  Route.post("login", "AuthController.login");

  Route.get("get-featured", "FrontEndController.getFeaturedProducts");
})
  .prefix("api/v1")
  .namespace("Api");

Route.group(() => {
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
    )
    .middleware(
      new Map([
        [["products.index"], ["can:read-product"]],
        [["products.store"], ["can:create-product"]],
        [["products.update"], ["can:update-product"]],
        [["products.destroy"], ["can:delete-product"]]
      ])
    );

  Route.resource("product-descriptions", "ProductDescriptionController")
    .apiOnly()
    .validator(
      new Map([
        [
          ["product-descriptions.store", "product-descriptions.update"],
          ["StoreProductDescription"]
        ]
      ])
    )
    .middleware(
      new Map([
        [["product-descriptions.index"], ["can:read-product-description"]],
        [["product-descriptions.store"], ["can:create-product-description"]],
        [["product-descriptions.update"], ["can:update-product-description"]],
        [["product-descriptions.destroy"], ["can:delete-product-description"]]
      ])
    );

  Route.resource("product-attributes", "ProductAttributeController")
    .apiOnly()
    .validator(
      new Map([
        [
          ["product-attributes.store", "product-attributes.update"],
          ["StoreProductAttribute"]
        ]
      ])
    )
    .middleware(
      new Map([
        [["product-attributes.index"], ["can:read-product-attribute"]],
        [["product-attributes.store"], ["can:create-product-attribute"]],
        [["product-attributes.update"], ["can:update-product-attribute"]],
        [["product-attributes.destroy"], ["can:delete-product-attribute"]]
      ])
    );

  Route.resource("product-medias", "ProductMediaController")
    .apiOnly()
    .validator(
      new Map([
        [
          ["product-medias.store", "product-medias.update"],
          ["StoreProductMedia"]
        ]
      ])
    )
    .middleware(
      new Map([
        [["product-medias.index"], ["can:read-product-media"]],
        [["product-medias.store"], ["can:create-product-media"]],
        [["product-medias.update"], ["can:update-product-media"]],
        [["product-medias.destroy"], ["can:delete-product-media"]]
      ])
    );
})
  .prefix("api/v1")
  .namespace("Api")
  .middleware("auth");
