// index.js: Performs all setup for express web application

// call this first to decrypt all environment variables stored in ".secure.env"
require("enigma-env").run();

// load all necessary packages
const core = require("./lib/core.js");

// pass all modules needed to setup the application
// be sure all paths are relative to the root of the project
core.setupModules([
  "./lib/setups/express",
  "./lib/setups/ejs",
  "./lib/setups//nodemailer",
  "./lib/features/home/setup",
  "./lib/features/about/setup",
  "./lib/features/contact/setup",
  "./lib/features/support/setup",
]);

try {
  // start listening for browser requests
  core.app.listen(process.env.SERVER_PORT, () => {
    console.info(`Server is listening on port: ${process.env.SERVER_PORT}`);
  });
} catch (err) {
  core.fatal(err.message);
}
