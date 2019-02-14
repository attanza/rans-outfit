"use strict";

const Hash = use("Hash");

const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId();

const UserHook = (module.exports = {});

UserHook.hashPassword = async userInstance => {
  if (userInstance.password) {
    userInstance.password = await Hash.make(userInstance.password);
  }
};

UserHook.generateUid = async dbInstance => {
  dbInstance.id = await uid.randomUUID(24);
};
