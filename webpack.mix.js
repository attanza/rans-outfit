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
  .stylus("resources/assets/styl/app.styl", "public/css/app.css")
  .combine(
    ["public/css/noty.css", "public/css/metroui.css"],
    "public/css/admin.css"
  )
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
    "public/css/vendor.css"
  );
