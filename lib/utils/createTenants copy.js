// createTenants.js

import Tenants from "./tenants.js";
import createDBConnection from "./createDBConnection.js";
//import createLogger from "./createLogger.js";
import createMailer from "./createMailer.js";

/**
 * Initializes all tenants from the provided configuration.
 * Fails if any tenant cannot be fully initialized.
 *
 * @param {object} config - The application config object with a "Tenants" array.
 * @returns {Promise<Tenants>} A fully initialized Tenants instance.
 * @throws Will throw an error if tenant initialization fails.
 */
export default async function createTenants(config) {
  if (!config || !Array.isArray(config.Tenants)) {
    throw new Error(`Invalid config: expected "Tenants" array`);
  }
  console.debug("here 0");
  /*
  const services = {
    db: createDBConnection,
    logger: createLogger,
    mailer: createMailer,
  };
  console.debug("here 1");

  const tenants = new Tenants();
  console.debug("here 2");

  try {
    await tenants.addList(config.Tenants, services);
    console.debug("here 3");
  } catch (err) {
    // Fail fast — tenant loading is all-or-nothing
    throw new Error(
      `[createTenants] Failed to initialize tenants: ${err.message}`
    );
  }

  return tenants;
  */
  return null;
}
