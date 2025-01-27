// tlx.js: module to setup express-template-literal template engine with express application

"use strict";

// load all necessary packages
const path = require("path");
const confirm = require("confirm-env");
const templateLiteralEngine = require("/users/miketerry.org/code/miketerry.org/packages/express-tlx");

// setup the application with the template literal view engine
function setup(core) {
  // ensure the template path is defined or use default
  confirm("TEMPLATES_PATH", "templates").isPath(false);

  // Set up the engine
  core.app.engine("tlx", templateLiteralEngine);
  core.app.set("view engine", "tlx");
  core.app.set("views", process.env.TEMPLATES_PATH);
}

// export the function to setup handlebars view engine
module.exports = { setup };
