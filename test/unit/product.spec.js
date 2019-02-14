"use strict";

const { test, trait, before } = use("Test/Suite")("Products");
const User = use("App/Models/User");
const Product = use("App/Models/Product");
const Chance = require("chance");
const chance = new Chance();
const { RedisHelper } = use("App/Helpers");

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

test("Product List", async ({ client }) => {
  const endpoint = "/api/v1/products";
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();

  response.assertStatus(200);
});

test("Product Store with uncomplete data will failed", async ({ client }) => {
  const endpoint = "/api/v1/products";
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Product Store", async ({ client, assert }) => {
  const endpoint = "/api/v1/products";
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .send(postData)
    .end();
  response.assertStatus(201);
  const respResult = JSON.parse(response.text);
  assert.isObject(respResult);
  assert.isObject(respResult.data);
  assert.isString(respResult.data.id);
  let product = await Product.find(respResult.data.id);
  product = product.toJSON();
  assert.isObject(product);
  assert.equal(product.name, postData.name);
  const cache = await RedisHelper.get(`Product_${product.id}`);
  assert.isNull(cache);
});

test("Product Show with wrong id will failed", async ({ client }) => {
  const endpoint = "/api/v1/products/hjkasdh879879";
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(400);
});

test("Product Show", async ({ client, assert }) => {
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
  const cache = await RedisHelper.get(`Product_${product.id}`);
  assert.isObject(cache);
});

test("Product Update", async ({ client, assert }) => {
  const product = await Product.create(postData);
  console.log("product", product.toJSON());

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
  const respResult = JSON.parse(response.text);

  assert.isObject(respResult);
  assert.isObject(respResult.data);
  assert.isString(respResult.data.id);
  let updatedProduct = await Product.find(product.id);
  updatedProduct = updatedProduct.toJSON();
  assert.isObject(updatedProduct);
  assert.equal(updatedProduct.name, postUpdateData.name);
  const cache = await RedisHelper.get(`Product_${updatedProduct.id}`);
  assert.isNull(cache);
});

test("Product Update Product with uncomplete data will failed", async ({
  client
}) => {
  const product = await Product.create(postData);
  const endpoint = "/api/v1/products/" + product.id;
  const response = await client
    .put(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Product Update Product with wrong id will failed", async ({ client }) => {
  const endpoint = "/api/v1/products/hdajsdh728939";
  const response = await client
    .put(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Product Delete Product", async ({ client }) => {
  const product = await Product.create(postData);
  const endpoint = "/api/v1/products/" + product.id;
  const response = await client
    .delete(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(200);
});

test("Product Delete Product with unknown id will failed", async ({
  client
}) => {
  const endpoint = "/api/v1/products/djhaksdh2379";
  const response = await client
    .delete(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(400);
});
