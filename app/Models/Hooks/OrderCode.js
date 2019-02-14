"use strict"

const moment = require("moment")
const OrderCodeHook = (module.exports = {})

/**
 * Hash using password as a hook.
 *
 * @method
 *
 * @param  {Object} orderCodeInstance
 *
 * @return {void}
 */
OrderCodeHook.generateDateString = async orderCodeInstance => {
  const now = moment()
  orderCodeInstance.date = now.format("YYMMDD").toString()
}
