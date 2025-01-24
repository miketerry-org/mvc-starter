// template-literal.js: module to setup express-template-literal template engine with express application

"use strict";

// load all necessary packages
const path = require("path");
const confirm = require("confirm-env");
const templateLiteralEngine = require("express-template-literal");

// setup the application with the template literal view engine
function setup(core) {
  // ensure the template path is defined or use default
  confirm("TEMPLATES_PATH", "templates").isPath(false);

  // Set up the engine
  core.app.engine("tpl.js", templateLiteralEngine);
  core.app.set("view engine", "tpl.js");
  core.app.set("views", process.env.TEMPLATES_PATH);
}

// export the function to setup handlebars view engine
module.exports = { setup };
