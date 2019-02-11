"use strict";

const { test, trait, before } = use("Test/Suite")("Auth");
const User = use("App/Models/User");
trait("Test/ApiClient");
trait("Auth/Client");
trait("Session/Client");

let user;

before(async () => {
  user = await User.first();
});

test("Auth Login", async ({ client }) => {
  const endpoint = "/api/v1/login";
  const response = await client
    .post(endpoint)
    .send({
      email: user.email,
      password: "password"
    })
    .end();
  response.assertStatus(200);
});
