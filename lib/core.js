// core.js: Implements core object

// Load all necessary packages
const path = require("path");
const fs = require("fs");

// Global application and mailer  variables
let _app = null;
let _db = null;
let _emailer = null;
let _services = {};
let _projectRoot = null;

function fatalError(err) {
  console.error("Fatal", err);
  process.exit(1);
}

function findProjectRoot(markerFile = "package.json") {
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    const markerPath = path.join(currentDir, markerFile);
    if (fs.existsSync(markerPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  // marker file not found so unable to find project root
  return null;
}

// return true if current node environment matches parameter
function isNodeEnv(mode) {
  let value = process.env.NODE_ENV;
  return value && value.toUpperCase() === mode.toUpperCase();
}

// Core object definition
const core = {
  // return the global app as a property of core
  get app() {
    if (_app) {
      return _app;
    } else {
      throw new Error(
        `The "core.bindApp" method must be called to assign the Express application`
      );
    }
  },

  // assign the app value to the global app variable
  bindApp: (value) => {
    _app = value;
  },

  // return the global database as a property of the core object
  get db() {
    if (_db) {
      return _db;
    } else {
      throw new Error(`The "core.bindDb" method must be called.`);
    }
  },

  // assign the database to the global db variable
  bindDB: (value) => {
    _db = value;
  },

  // return the global emailer as a property of core
  get emailer() {
    if (_emailer) {
      return _emailer;
    } else {
      throw new Error(`The "core.bindEmailer" method must be called.`);
    }
  },

  // assign the emailer value to the global emailer variable
  bindEmailer: (value) => {
    _emailer = value;
  },

  // return object containing services
  get services() {
    return _services;
  },

  // bind a service to the global object
  bindServiceMethod: (serviceName, method) => {
    if (typeof method !== "function") {
      throw new Error("The provided method must be a function.");
    }

    // Check if the function has a name
    if (!method.name) {
      throw new Error("The provided function must have a name.");
    }

    // Ensure the service namespace exists
    if (!_services[serviceName]) {
      _services[serviceName] = {};
    }

    // Add the method to the service object
    _services[serviceName][method.name] = method;
  },

  // return true if node environment is development
  get isDevelopment() {
    return isNodeEnv("dev");
  },

  // return true if node environment is production
  get isProduction() {
    return isNodeEnv("prod");
  },

  // return true if node environment is testing
  get isTesting() {
    return isNodeEnv("test");
  },

  // use array of module names/paths to load all necessary modules
  setupModules: (moduleNames = []) => {
    moduleNames.forEach((moduleName) => {
      try {
        // load the specified module as we were in the main application
        let module = require.main.require(moduleName);

        // determine if module has setup function
        let hasSetup =
          module &&
          typeof module === "object" &&
          typeof module.setup === "function";

        // if there is a setup method then call it
        if (hasSetup) {
          module.setup(core);
        }
      } catch (err) {
        fatalError(err);
      }
    });
  },

  /**
   * Recursively finds the project root directory based on the presence of a specified file.
   * By default, it looks for "package.json".
   *
   * @param {string} [startDir=process.cwd()] - The directory to start searching from.
   * @param {string} [markerFile='package.json'] - The file that identifies the project root.
   * @returns {string|null} - The absolute path to the project root or null if not found.
   */
  get projectRoot() {
    if (!_projectRoot) {
      _projectRoot = findProjectRoot();
    }
    return _projectRoot;
  },

  // display fatal error message and terminate program execution
  fatal: (err) => {
    fatalError(err);
  },
};

// export the core object
module.exports = core;
