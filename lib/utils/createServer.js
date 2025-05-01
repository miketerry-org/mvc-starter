// createServer.js

// Load all necessary packages
import path from "path";
import fs from "fs";
import http from "http";
import https from "https";
import config from "../config.js";

// Function to create the server
export default async function createServer(app) {
  let server;

  // If not in production mode, use local SSL certificates and create an HTTPS server
  if (!config.isProduction) {
    // Initialize key and certificate file names
    const keyFilename = path.resolve("ssl-certs/mvc-starter.key");
    const certFilename = path.resolve("ssl-certs/mvc-starter.crt");

    console.debug("keyFilename:", keyFilename);
    console.debug("certFilename:", certFilename);

    // Read SSL certificates
    const certificates = {
      key: fs.readFileSync(keyFilename),
      cert: fs.readFileSync(certFilename),
    };

    // Create the HTTPS server
    server = https.createServer(certificates, app);

    console.debug("HTTPS server created");
  } else {
    // When in production, create a plain HTTP server (assuming reverse proxy handles SSL)
    server = http.createServer(app);

    console.debug("HTTP server created");
  }

  // Return the server object
  return server;
}
