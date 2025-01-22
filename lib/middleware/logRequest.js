// logRequestMiddleware.js:

"use strict";

// load all necessary modules
const path = require("path");
const fs = require("fs");

// middleware to log requests
function logRequest() {
  return (req, res, next) => {
    // get the fully qualified filename
    console.log("sp", process.env.STATIC_PATH);
    const filePath = path.join(process.env.STATIC_PATH, req.url);
    console.log("Fp", filePath);

    // Log request
    console.info(`Request: ${req.method} ${req.url}`);

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.warn(`File does not exist: ${filePath}`);
      } else if (stats.isFile()) {
        console.info(`File exists: ${filePath}`);
      } else {
        console.warn(`Path is not a file: ${filePath}`);
      }
    });

    // Hook into the response to log when it's sent
    const originalSend = res.send;
    res.send = function (body) {
      console.info(`Response: ${res.statusCode} ${req.url}`);
      originalSend.call(this, body);
    };

    next();
  };
}

// export the log request middleware
module.exports = logRequest;
