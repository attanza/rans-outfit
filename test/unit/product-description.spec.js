"use strict";

const { test, trait, before } = use("Test/Suite")("ProductDescription");
const User = use("App/Models/User");
const Product = use("App/Models/Product");
const ProductDescription = use("App/Models/ProductDescription");
const Chance = require("chance");
const chance = new Chance();
const endpoint = "/api/v1/product-descriptions";
const { RedisHelper } = use("App/Helpers");
trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");
trait("DatabaseTransactions");

let user;
let product;
let postData;

before(async () => {
  user = await User.first();
  product = await Product.first();
  postData = {
    product_id: product.id,
    short_description: chance.paragraph(),
    long_description: chance.paragraph()
  };
});

test("Description List", async ({ client }) => {
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();

  response.assertStatus(200);
});

test("Description Store", async ({ client, assert }) => {
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .send(postData)
    .end();
  response.assertStatus(201);
  const cache = await RedisHelper.get(`Product_${postData.product_id}`);
  assert.isNull(cache);
});

test("Description Store with uncomplete Data will failed", async ({
  client
}) => {
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Description Show with wrong id will failed", async ({ client }) => {
  const response = await client
    .get(endpoint + "/hjkasdh879879")
    .loginVia(user)
    .end();
  response.assertStatus(400);
});

test("Description Show", async ({ client }) => {
  const data = await ProductDescription.create(postData);
  const response = await client
    .get(`${endpoint}/${data.id}`)
    .loginVia(user)
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    meta: {
      status: 200,
      message: "Data retrieval successfully"
    },
    data: {
      product_id: postData.product_id,
      short_description: postData.short_description,
      long_description: postData.long_description
    }
  });
});

test("Description Update", async ({ client, assert }) => {
  const postData2 = {
    product_id: product.id,
    short_description: chance.paragraph(),
    long_description: chance.paragraph()
  };
  const data = await ProductDescription.create(postData);
  const response = await client
    .put(`${endpoint}/${data.id}`)
    .send(postData2)
    .loginVia(user)
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    meta: {
      status: 200,
      message: "Updated successfully"
    },
    data: {
      product_id: postData2.product_id,
      short_description: postData2.short_description,
      long_description: postData2.long_description
    }
  });
  const cache = await RedisHelper.get(`Product_${postData.product_id}`);
  assert.isNull(cache);
});

test("Description Update with uncomplete data will failed", async ({
  client
}) => {
  const data = await ProductDescription.create(postData);
  const response = await client
    .put(`${endpoint}/${data.id}`)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Description Update with wrong id will failed", async ({ client }) => {
  const response = await client
    .put(endpoint + "/hdajsdh728939")
    .loginVia(user)
    .send(postData)
    .end();
  response.assertStatus(400);
});

test("Description Delete", async ({ client, assert }) => {
  const product = await ProductDescription.create(postData);
  const response = await client
    .delete(`${endpoint}/${product.id}`)
    .loginVia(user)
    .end();
  response.assertStatus(200);
  const cache = await RedisHelper.get(`Product_${postData.product_id}`);
  assert.isNull(cache);
});

test("Description Delete with unknown id will failed", async ({ client }) => {
  const response = await client
    .delete(endpoint + "/djhaksdh2379")
    .loginVia(user)
    .end();
  response.assertStatus(400);
});
