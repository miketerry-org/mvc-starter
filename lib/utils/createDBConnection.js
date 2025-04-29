// createDBConnection.js

import confirm from "confirm-json";
import mongoose from "mongoose";
import { parse } from "url";

/**
 * Establishes a Mongoose connection with timeout and logging.
 * @param {Object} config - Must include db_url
 * @returns {Promise<mongoose.Connection>}
 */
export default async function createDBConnection(config) {
  const timeoutMs = 10000;

  const validate = new confirm(config);
  validate.isString("db_url", undefined, 1, 255);

  if (validate.errors.length > 0) {
    throw new Error(
      `DB connection config invalid: ${validate.errors.join("\n")}`
    );
  }

  const { db_url } = config;

  // Extract database name from URL for labeling
  let dbName = "UnknownDB";
  try {
    const parsed = new URL(db_url);
    dbName = parsed.pathname.replace(/^\//, "") || dbName;
  } catch {
    // Ignore parse error, keep default
  }

  const label = `Database "${dbName}"`;
  const connection = mongoose.createConnection(db_url, {});

  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      connection.removeAllListeners();
      reject(new Error(`${label}: Connection timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    connection.once("connected", () => {
      clearTimeout(timer);
      console.info(`${label}: Connected to "${connection.name}"`);
      resolve(connection);
    });

    connection.once("error", err => {
      clearTimeout(timer);
      console.error(`${label}: Connection error: ${err.message}`);
      reject(new Error(`${label}: ${err.message}`));
    });

    connection.on("disconnected", () => {
      console.info(`${label}: Disconnected from "${connection.name}"`);
    });
  });
}
