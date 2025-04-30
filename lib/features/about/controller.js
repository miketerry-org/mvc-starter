// controller.js: about page controller functions

// controller function to return About page
export function getAboutPage(req, res) {
  res.render("features/about/index", { layout: false });
}
