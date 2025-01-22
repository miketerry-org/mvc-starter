// controller.js: about page controller functions

// controller function to return About page
function getAboutPage(req, res) {
  res.render("feature/about/index");
}

// export all controller functions
module.exports = { getAboutPage };
