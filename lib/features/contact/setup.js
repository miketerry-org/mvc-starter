// setup.js: contact page setup function

// load all necessary packages
const { getContactPage } = require("./controller");

// implement setup function to initialize contact page with express application
function setup(core) {
  core.app.get("/contact", getContactPage);
}

// export the setup function
module.exports = { setup };
