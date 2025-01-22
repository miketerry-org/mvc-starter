// index.js: Performs all setup for express web application
// call this first to decrypt all environment variables stored in ".secure.env"
require("enigma-env").run();

// load all necessary packages
const core = require("./lib/core.js");

// pass all modules needed to setup the application
// be sure all paths are relative to the root of the project
core.setupModules([
  "./lib/setup/express",
  "./lib/setup/handlebars",
  "./lib/setup//nodemailer",
  "./lib/feature/home/setup",
  "./lib/feature/about/setup",
  "./lib/feature/contact/setup",
  "./lib/feature/support/setup",
]);

try {
  // start listening for browser requests
  core.app.listen(process.envSERVER_PORT, () => {
    console.info(`Server is listening on port: ${process.env.SERVER_PORT}`);
  });
} catch (err) {
  core.fatal(err.message);
}
