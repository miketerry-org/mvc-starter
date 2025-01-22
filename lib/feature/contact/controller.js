// controller.js: contact page controller functions

// controller function to return contact page
function getContactPage(req, res) {
  res.render("feature/contact/index");
}

// export all controller functions
module.exports = { getContactPage };
