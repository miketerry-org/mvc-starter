// setupjs: home page setup function for @zyx/core

// load all necessary packages
const { getHomePage } = require("./controller");

// implement setup function to initialize home page with express application
function setup(core) {
  core.app.get("/", getHomePage);
}

// export the setup function used by @zyx/core
module.exports = { setup };
