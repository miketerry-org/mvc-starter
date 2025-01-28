// index.js: Performs all setup for express web application

// call this first to decrypt all environment variables stored in ".secure.env"
require("enigma-env").run();

// load all necessary packages
const fs = require("fs");
const http = require("http");
const https = require("https");
const core = require("./lib/core.js");

// pass all modules needed to setup the application
// be sure all paths are relative to the root of the project
core.setupModules([
  "./lib/setups/express",
  "./lib/setups/handlebars",
  "./lib/setups//nodemailer",
  "./lib/features/home/setup",
  "./lib/features/about/setup",
  "./lib/features/contact/setup",
  "./lib/features/support/setup",
]);

try {
  // Determine which server to start based on NODE_ENV
  if (process.env.NODE_ENV === "DEV") {
    // Define paths to SSL certificates (if in development mode)
    const sslOptions =
      process.env.NODE_ENV === "DEV"
        ? {
            key: fs.readFileSync("localhost-key.pem"),
            cert: fs.readFileSync("localhost.pem"),
          }
        : null;

    https.createServer(sslOptions, core.app).listen(8080, () => {
      console.log("HTTPS server running on https://localhost:8080");
    });
  } else {
    // Production or other environments (HTTP)
    http.createServer(core.app).listen(8080, () => {
      console.log("HTTP server running on http://localhost:8080");
    });
  }
} catch (err) {
  core.fatal(err.message);
}
