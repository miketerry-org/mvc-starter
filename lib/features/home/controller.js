// controller.js: home page controller functions

// controller function to return home page
export function getHomePage(req, res) {
  console.debug("res.locals.layout", res.locals.layout);
  res.render("features/home/index");
}
