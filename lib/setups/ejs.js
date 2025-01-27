// ejs.js: module to setup EJS template engine with express application

"use strict";

// load all necessary packages
const express = require("express");
const ejs = require("ejs");
const confirm = require("confirm-env");

// setup the application with the EJS view engine
function setup(core) {
  // ensure the views path is defined or use default
  confirm("VIEWS_PATH", "VIEWS").isPath(false);

  // ensure the views file extension is defined or use default
  confirm("VIEWS_EXT_NAME", ".ejs").isDefined;

  // Set up EJS as the view engine
  core.app.set("view engine", "ejs");
  core.app.set("views", process.env.VIEWS_PATH);

  // Disable view caching to make debugging easier (you can enable it in production)
  if (core.isProduction) {
    core.app.enable("view cache");
  }

  // If you're rendering small fragments with HTMX, ensure EJS does not try to use layouts
  core.app.set("view options", { layout: false });
}

// export the function to setup EJS view engine
module.exports = { setup };
