// handlebars.js: module to setup handlebars template engine with express application

"use strict";

// load all necessary packages
const express = require("express");
const exphbs = require("express-handlebars");
const confirm = require("confirm-env");

// setup the application with the handlebars view engine
function setup(core) {
  // ensure the template path is defined in environment variable or use default
  confirm("TEMPLATE_PATH", "TEMPLATE").isPath(true);

  // ensure the layout path is defined in environment variable or use default
  confirm("LAYOUT_PATH", "template/LAYOUT").isPath(true);

  // ensure the partial path is defined in environment variable or use default
  confirm("PARTIAL_PATH", "template/partial").isPath(true);

  // ensure the views file extension is defined or use default
  confirm("TEMPLATE_EXTNAME", ".hbs").isDefined;

  // ensure the static path is defined
  confirm("STATIC_PATH", "public").isDefined(true);

  // Configure handlebars with custom directories
  const hbs = exphbs.create({
    defaultLayout: "main", // Default layout name
    layoutsDir: process.env.LAYOUT_PATH,
    partialsDir: process.env.PARTIAL_PATH,
    extname: process.env.TEMPLATE_EXTNAME,
  });

  // Set up the engine
  core.app.engine("hbs", hbs.engine);
  core.app.set("view engine", "hbs");
  core.app.set("views", process.env.TEMPLATE_PATH); // Views folder path

  // if in production mode then cashe all compiled templates
  if (core.isProduction) {
    core.app.enable("view cache");
  }

  // Set static folder
  core.app.use(express.static(process.env.STATIC_PATH));
}

// export the function to setup handlebars view engine
module.exports = { setup };
