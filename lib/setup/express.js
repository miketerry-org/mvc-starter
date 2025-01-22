// express.js: exports setup function to initialize express

"use strict";

// load all module dependencies
const path = require("path");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const confirm = require("confirm-env");
const assignLocals = require("../middleware/assignLocals");
const logRequest = require("../middleware/logRequest");

// perform all configuration for the global application
function setup(core) {
  // confirm existence and validity of all required environment variables
  confirm("SERVER_PORT").isGE(1000).isLE(65000);
  confirm("STATIC_PATH", "public").isPath(false);
  confirm("SESSION_SECRET").hasLength(30, 100);
  confirm("SESSION_TIMEOUT").isGE(10);
  confirm("RATE_LIMIT_MS").isGE(0);
  confirm("RATE_LIMIT_MAX").isGE(0);
  confirm("TOKEN_EXPERATION", 10).isGE(5).isLE(60);
  confirm("PROJECT_TITLE").isDefined;
  confirm("PROJECT_SLOGAN").isDefined;
  confirm("PROJECT_OWNER").isDefined;

  // perform initial creation of express application
  const app = express();

  // always assign locals to response to be used in view templates
  app.use(assignLocals);

  // if in development mode then log all URLs requested
  if (core.isDevelopment) {
    app.use(logRequest());
  }

  // assign Body parser for both JSON and urlencoded form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // assign Cookie parser
  app.use(cookieParser());

  // initialize and assign session store
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: core.isProduction,
        httpOnly: true,
        maxAge: process.env.SESSION_TIMEOUT * 60000,
      },
    })
  );

  // Dev logging middleware
  if (core.isDevelopment) {
    app.use(morgan("dev"));
  }

  // assign File uploading
  app.use(fileupload());

  // assign security headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

  // assign Rate limiting
  app.use(
    rateLimit({
      windowMs: process.env.RATE_LIMIT_MS,
      max: process.env.RATE_LIMIT_MAX,
    })
  );

  // Prevent HTTP param pollution
  app.use(hpp());

  // Enable CORS
  app.use(cors());

  // bind the fully initialized express application to the core module
  core.bindApp(app);
}

// export the setup function as property of object
module.exports = { setup };
