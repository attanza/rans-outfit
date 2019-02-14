"use strict"

const Hash = use("Hash")

const ShortUniqueId = require("short-unique-id")
const uid = new ShortUniqueId()

const UserHook = (module.exports = {})

/**
 * Hash using password as a hook.
 *
 * @method
 *
 * @param  {Object} userInstance
 *
 * @return {void}
 */
UserHook.hashPassword = async userInstance => {
  if (userInstance.password) {
    userInstance.password = await Hash.make(userInstance.password)
  }
}

/**
 * UID Generator.
 *
 * @method
 *
 * @param  {Object} userInstance
 *
 * @return {void}
 */
UserHook.generateUid = async dbInstance => {
  dbInstance.id = await uid.randomUUID(24)
}
