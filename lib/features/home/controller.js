// controller.js: home page controller functions

// controller function to return home page
export function getHomePage(req, res) {
  console.debug("home controller res.locals", res.locals);
  console.debug("homeController tenant.config.site", req.tenant.config.site);
  res.render("features/home/index");
}
