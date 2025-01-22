// controller.js: home page controller functions

// controller function to return home page
function getHomePage(req, res) {
  res.render("features/home/index");
}

// export all controller functions
module.exports = { getHomePage };
