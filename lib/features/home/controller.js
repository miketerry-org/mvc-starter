// controller.js: home page controller functions

"use strict";

// load all necessary modules
const tplLayout = require("../../../templates/layout.tpl.js");
const tplHome = require("../../../templates/home.tpl.js");

// controller function to return home page
function getHomePage(req, res) {
  //!!mike this is temporary
  let project = {
    title: "MVC Starter",
    slogan: "MVC starter web application",
    owner: "miketerry.org",
    year: 2025,
  };

  let auth = { isLoggedIn: false };

  // combine layout qand home templates to form complete web page
  res.send(tplLayout(project, auth, tplHome()));
}

// export all controller functions
module.exports = { getHomePage };
