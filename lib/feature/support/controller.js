// controller.js: Support page controller functions

// controller function to return Support page
function getSupportPage(req, res) {
  res.render("feature/support/index");
}

// export all controller functions
module.exports = { getSupportPage };
