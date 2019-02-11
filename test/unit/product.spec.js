"use strict";

const { test, trait, before } = use("Test/Suite")("Products");
const User = use("App/Models/User");
const Product = use("App/Models/Product");
const Chance = require("chance");
const chance = new Chance();

trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");
trait("DatabaseTransactions");
let user;

before(async () => {
  user = await User.first();
});

const postData = {
  product_category_id: 1,
  code: chance.bb_pin(),
  name: chance.name(),
  regular_price: 100000,
  sell_price: 98000,
  discount: 3,
  tax: 10,
  stock: 10,
  stock_status_id: 1,
  ordering: 1,
  material: chance.name(),
  is_featured: 1,
  is_publish: 1
};

const postUpdateData = {
  product_category_id: 1,
  code: chance.bb_pin(),
  name: chance.name(),
  regular_price: 100000,
  sell_price: 98000,
  discount: 3,
  tax: 10,
  stock: 10,
  stock_status_id: 1,
  ordering: 1,
  material: chance.name(),
  is_featured: 1,
  is_publish: 1
};

test("List", async ({ client }) => {
  const endpoint = "/api/v1/products";
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();

  response.assertStatus(200);
});

test("Store Product with uncomplete data will failed", async ({ client }) => {
  const endpoint = "/api/v1/products";
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Store Product", async ({ client, assert }) => {
  const endpoint = "/api/v1/products";
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .send(postData)
    .end();
  response.assertStatus(201);
  const product = await Product.findBy("name", postData.name);
  assert.isObject(product);
  assert.equal(product.code, postData.code);
});

test("Show Product with wrong id will failed", async ({ client }) => {
  const endpoint = "/api/v1/products/hjkasdh879879";
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(400);
});

test("Show Product", async ({ client }) => {
  const product = await Product.create(postData);
  const endpoint = "/api/v1/products/" + product.id;
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    meta: {
      status: 200,
      message: "Data retrieval successfully"
    },
    data: {
      product_category_id: postData.product_category_id,
      code: postData.code,
      name: postData.name
    }
  });
});

test("Update Product", async ({ client }) => {
  const product = await Product.create(postData);
  const endpoint = "/api/v1/products/" + product.id;
  const response = await client
    .put(endpoint)
    .send(postUpdateData)
    .loginVia(user)
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    meta: {
      status: 200,
      message: "Updated successfully"
    },
    data: {
      product_category_id: postUpdateData.product_category_id,
      code: postUpdateData.code,
      name: postUpdateData.name
    }
  });
});

test("Update Product with uncomplete data will failed", async ({ client }) => {
  const product = await Product.create(postData);
  const endpoint = "/api/v1/products/" + product.id;
  const response = await client
    .put(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Update Product with wrong id will failed", async ({ client }) => {
  const endpoint = "/api/v1/products/hdajsdh728939";
  const response = await client
    .put(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Delete Product", async ({ client }) => {
  const product = await Product.create(postData);
  const endpoint = "/api/v1/products/" + product.id;
  const response = await client
    .delete(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(200);
});

test("Delete Product with unknown id will failed", async ({ client }) => {
  const endpoint = "/api/v1/products/djhaksdh2379";
  const response = await client
    .delete(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(400);
});
