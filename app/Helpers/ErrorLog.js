const Env = use("Env");
const ErrorLog = use("App/Models/ErrorLog");
const MailHelper = require("./MailHelper");
module.exports = async (request, e) => {
  const NODE_ENV = Env.get("NODE_ENV");
  if (NODE_ENV === "development") {
    console.log(e);
  } else {
    await ErrorLog.create({
      url: request.url(),
      method: request.method(),
      error: e.message
    });
    const subject = `ransoutfit error: ${request.method()} ${request.url()}`;
    MailHelper.sendError(subject, e);
  }
};
