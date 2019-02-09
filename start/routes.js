"use strict";

const Route = use("Route");

Route.get("/", "HomeController.index");

require("./routes/admin");
require("./routes/api");
