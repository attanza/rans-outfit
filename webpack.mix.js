let mix = require("laravel-mix");

mix
  .disableSuccessNotifications()
  .js("resources/assets/js/app.js", "public/js")
  .sass("node_modules/noty/src/noty.scss", "public/css")
  .sass("node_modules/noty/src/themes/metroui.scss", "public/css")
  .stylus("resources/assets/styl/app.styl", "public/css")
  .styles(["resources/assets/css/custom.css"], "public/css/custom.css")
  .combine(
    [
      "public/css/noty.css",
      "public/css/metroui.css",
      "public/css/animate.css",
      "public/css/app.css",
      "public/css/custom.css"
    ],
    "public/css/all.css"
  );
