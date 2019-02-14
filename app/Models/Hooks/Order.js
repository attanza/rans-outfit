"use strict"

const { GenerateOrderCode } = use("App/Traits")
const OrderHook = (module.exports = {})

/**
 * Hash using password as a hook.
 *
 * @method
 *
 * @param  {Object} orderInstance
 *
 * @return {void}
 */
OrderHook.generateCode = async orderInstance => {
  orderInstance.code = await GenerateOrderCode()
}
