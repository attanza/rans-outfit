let mix = require("laravel-mix");

mix
  .disableSuccessNotifications()
  .js("resources/assets/js/app.js", "public/js")
  .scripts(
    [
      "public/js/jquery.js",
      "public/js/bootstrap.min.js.js",
      "public/js/jquery.scrollUp.min.js",
      "public/js/price-range.js",
      "public/js/jquery.prettyPhoto.js",
      "public/js/main.js"
    ],
    "public/js/vendor.js"
  )
  .sass("node_modules/noty/src/noty.scss", "public/css")
  .sass("node_modules/noty/src/themes/metroui.scss", "public/css")
  .stylus("resources/assets/styl/app.styl", "public/css")
  .styles(["resources/assets/css/custom.css"], "public/css/custom.css")
  .combine(
    [
      "public/css/bootstrap.min.css",
      "public/css/font-awesome.min.css",
      "public/css/prettyPhoto.css",
      "public/css/price-range.css",
      "public/css/animate.css",
      "public/css/responsive.css",
      "public/css/main.css"
    ],
    "public/css/all.css"
  );
