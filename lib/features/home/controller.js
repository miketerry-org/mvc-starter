// controller.js: home page controller functions

"use strict";

// controller function to return home page
function getHomePage(req, res) {
  console.clear();
  console.log("res.locals", res.locals);
  let user = {};
  user.firstname = "donald";
  user.lastname = "duck";
  res.render("index", { PROJECT_TITLE: "project_title" });
}

// export all controller functions
module.exports = { getHomePage };
