"use strict";

const { test, trait, before } = use("Test/Suite")("Product Attribute");
const User = use("App/Models/User");
const Product = use("App/Models/Product");
const ProductAttribute = use("App/Models/ProductAttribute");
const Chance = require("chance");
const chance = new Chance();
const endpoint = "/api/v1/product-attributes";

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
    name: chance.word(),
    value: chance.word()
  };
});

test("Attribute List", async ({ client }) => {
  const response = await client
    .get(endpoint)
    .loginVia(user)
    .end();

  response.assertStatus(200);
});

test("Attribute Store", async ({ client, assert }) => {
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .send(postData)
    .end();
  response.assertStatus(201);
  let attributes = await ProductAttribute.query()
    .where("product_id", postData.product_id)
    .fetch();
  attributes = attributes.toJSON();
  assert.isArray(attributes);
  assert.equal(attributes[0].name, postData.name);
});

test("Attribute Bulk Store", async ({ client, assert }) => {
  const bulkData = {
    product_id: product.id,
    attributes: [
      { name: chance.word(), value: chance.word() },
      { name: chance.word(), value: chance.word() }
    ]
  };
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .send(bulkData)
    .end();

  response.assertStatus(201);

  let attributes = await ProductAttribute.query()
    .where("product_id", postData.product_id)
    .fetch();
  attributes = attributes.toJSON();
  assert.isArray(attributes);
  assert.equal(attributes[0].name, bulkData.attributes[0].name);
});

test("Attribute Store with uncomplete Data will failed", async ({ client }) => {
  const response = await client
    .post(endpoint)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Attribute Show with wrong id will failed", async ({ client }) => {
  const response = await client
    .get(endpoint + "/hjkasdh879879")
    .loginVia(user)
    .end();
  response.assertStatus(400);
});

test("Attribute Show", async ({ client }) => {
  const data = await ProductAttribute.create(postData);
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
      name: postData.name,
      value: postData.value
    }
  });
});

test("Attribute Update", async ({ client, assert }) => {
  const postData2 = {
    product_id: product.id,
    name: chance.word(),
    value: chance.word()
  };

  let data = await ProductAttribute.create(postData);
  const response = await client
    .put(`${endpoint}/${data.id}`)
    .send(postData2)
    .loginVia(user)
    .end();
  response.assertStatus(200);
  data = data.toJSON();
  assert.equal(data.name, postData.name);

  response.assertJSONSubset({
    meta: {
      status: 200,
      message: "Updated successfully"
    }
  });
  let newData = await ProductAttribute.find(data.id);
  newData = newData.toJSON();
  assert.equal(newData.name, postData2.name);
});

test("Attribute Update with uncomplete data will failed", async ({
  client
}) => {
  const data = await ProductAttribute.create(postData);
  const response = await client
    .put(`${endpoint}/${data.id}`)
    .loginVia(user)
    .end();
  response.assertStatus(422);
});

test("Attribute Update with wrong id will failed", async ({ client }) => {
  const response = await client
    .put(endpoint + "/hdajsdh728939")
    .loginVia(user)
    .send(postData)
    .end();
  response.assertStatus(400);
});

test("Attribute Delete", async ({ client }) => {
  const product = await ProductAttribute.create(postData);
  const response = await client
    .delete(`${endpoint}/${product.id}`)
    .loginVia(user)
    .end();
  response.assertStatus(200);
});

test("Attribute Delete with unknown id will failed", async ({ client }) => {
  const response = await client
    .delete(endpoint + "/djhaksdh2379")
    .loginVia(user)
    .end();
  response.assertStatus(400);
});
