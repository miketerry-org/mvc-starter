// controller.js: contact page controller functions

// controller function to return contact page
function getContactPage(req, res) {
  res.render("features/contact/index", { layout: false });
}

// export all controller functions
module.exports = { getContactPage };
