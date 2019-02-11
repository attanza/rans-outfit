"use strict";

const BaseExceptionHandler = use("BaseExceptionHandler");

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { response, request }) {
    // console.log("error", error);
    // console.log("error.name", error.name);
    // console.log("message", error.message);
    // console.log("status", error.status);
    console.log("code", error.code);
    // console.log("status", error.status);

    const url = request.url();
    const urlSplit = url.split("/");

    if (error.code === "E_ROUTE_NOT_FOUND") {
      if (urlSplit && urlSplit[1] === "api") {
        return response.status(401).send({
          meta: {
            status: 404,
            message: "Route not found"
          }
        });
      }
      return response.redirect("/");
    }

    if (error.code === "E_GUEST_ONLY") {
      return response.redirect("/admin");
    }

    if (error.name === "InvalidSessionException") {
      if (urlSplit && urlSplit[1] === "api") {
        return response.status(401).send({
          meta: {
            status: 401,
            message: "Unathorized"
          }
        });
      }
      return response.redirect("/admin/login");
    }

    if (error.name === "InvalidJwtToken") {
      return response.status(401).send({
        meta: {
          status: 401,
          message: "Unathorized"
        }
      });
    }

    if (error.name === "ExpiredJwtToken") {
      return response.status(401).send({
        meta: {
          status: 401,
          message: "Expired token"
        }
      });
    }

    // if (error.name === "HttpException") {
    //   return response.status(404).send({
    //     meta: {
    //       status: 404,
    //       message: "Route not found"
    //     }
    //   });
    // }

    if (error.name === "ForbiddenException") {
      return response.status(403).send({
        meta: {
          status: 403,
          message: "Forbidden"
        }
      });
    }

    return super.handle(...arguments);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  // async report (error, { request }) {
  // }
}

module.exports = ExceptionHandler;
