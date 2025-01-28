// handlebars.js: module to setup handlebars template engine with express application

"use strict";

// load all necessary packages
const express = require("express");
const exphbs = require("express-handlebars");
const confirm = require("confirm-env");

// setup the application with the handlebars view engine
function setup(core) {
  // ensure the default layout is defined or use default value
  confirm("DEFAULT_LAYOUT", "main").isDefined;

  // ensure the views path is defined or use default
  confirm("VIEWS_PATH", "VIEWS").isPath(false);

  // ensure the partials path is defined in environment variable or use default
  confirm("PARTIALS_PATH", "views/partials").isPath(false);

  // ensure the layouts path is defined in environment variable or use default
  confirm("LAYOUTS_PATH", "views/layouts").isPath(false);

  // ensure the views file extension is defined or use default
  confirm("VIEWS_EXT_NAME", ".hbs").isDefined;

  // Configure handlebars with custom directories
  const hbs = exphbs.create({
    defaultLayout: process.env.DEFAULT_LAYOUT,
    layoutsDir: process.env.LAYOUTS_PATH,
    partialsDir: process.env.PARTIALS_PATH,
    extname: process.env.VIEWS_EXT_NAME,
  });

  // Set up the engine
  core.app.engine("hbs", hbs.engine);
  core.app.set("view engine", "hbs");
  core.app.set("views", process.env.VIEWS_PATH);

  // if in production mode then cashe all compiled templates
  if (core.isProduction) {
    core.app.enable("view cache");
  }
}

// export the function to setup handlebars view engine
module.exports = { setup };
