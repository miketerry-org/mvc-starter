// controller.js: home page controller functions

"use strict";

// controller function to return home page
function getHomePage(req, res) {
  let user = {};
  user.firstname = "donald";
  user.lastname = "duck";
  res.render("index", user);
}

// export all controller functions
module.exports = { getHomePage };
