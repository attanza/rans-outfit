"use strict";

const { test, trait, before } = use("Test/Suite")("ComboData");
const User = use("App/Models/User");
trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

let user;

before(async () => {
  user = await User.first();
});

test("Stock Status", async ({ client }) => {
  const endpoint = "/api/v1/combo-data?resource=StockStatus";
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(200);
});

test("Product Category", async ({ client }) => {
  const endpoint = "/api/v1/combo-data?resource=ProductCategory";
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(200);
});
