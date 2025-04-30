// createTenants.js

import Tenants from "./tenants.js";
import createDBConnection from "./createDBConnection.js";
import createLogger from "./createLogger.js";
import createMailer from "./createMailer.js";

export default async function createTenants(config) {
  // ensure the config.tenants parameter is an array
  if (!config || !config.tenants || !Array.isArray(config.tenants)) {
    throw new Error(
      `CreateTenants: "config.tenants" is undefined or not an array`
    );
  }

  // initialize the createServices object
  const createServices = {
    db: createDBConnection,
    logger: createLogger,
    mailer: createMailer,
  };

  // initialize empty list of tenant class instances
  const tenants = new Tenants();

  try {
    //define all tenants passed in tenants parameter
    await tenants.addList(config.tenants, createServices);
    return tenants;
  } catch (err) {
    // Fail fast — tenant loading is all-or-nothing
    throw new Error(
      `[createTenants] Failed to initialize tenants: ${err.message}`
    );
  }
}
