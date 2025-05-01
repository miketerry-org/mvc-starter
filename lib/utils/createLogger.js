// createLogger.js

import config from "../config.js";
import Confirm from "confirm-json";
import winston from "winston";
import "winston-mongodb";
import createDBConnection from "./createDBConnection.js";

/**
 * Creates and configures a Winston logger with optional MongoDB transport.
 *
 * @param {Object} config - Logging configuration (must include db_url, collection name, etc.)
 * @returns {Promise<winston.Logger>}
 */
export default async function createLogger(config) {
  const validator = new Confirm(config)
    .isString("log_collection_name", "logs", 1, 255)
    .isInteger("log_expiration_days", undefined, 1, 365, false)
    .isBoolean("log_capped", undefined, false)
    .isInteger("log_max_size", undefined, 1, 1000, false)
    .isInteger("log_max_docs", undefined, 1000, 1000000, false)
    .isString("db_url", undefined, 1, 255);

  if (validator.errors.length > 0) {
    throw new Error("Logger config invalid: " + validator.errors.join(", "));
  }

  const {
    log_collection_name,
    log_expiration_days,
    log_capped,
    log_max_size,
    log_max_docs,
    db_url,
  } = config;

  if (log_capped && log_expiration_days > 0) {
    throw new Error("Cannot use both capped and TTL options.");
  }

  const dbConnection = await createDBConnection(config);
  const db = dbConnection.db;

  const collectionExists =
    (await db.listCollections({ name: log_collection_name }).toArray()).length >
    0;

  const recreateCollection = config.isDevelopment;

  if (collectionExists && recreateCollection) {
    await db.dropCollection(log_collection_name);
  }

  if (!collectionExists || recreateCollection) {
    if (log_capped && log_max_size && log_max_docs) {
      await db.createCollection(log_collection_name, {
        capped: true,
        size: log_max_size * 1024 * 1024, // MB to bytes
        max: log_max_docs,
      });
    } else {
      await db.createCollection(log_collection_name).catch(err => {
        if (err.codeName !== "NamespaceExists") throw err;
      });

      if (log_expiration_days) {
        await db.collection(log_collection_name).createIndex(
          { timestamp: 1 },
          {
            name: "ttl_timestamp",
            expireAfterSeconds: log_expiration_days * 86400,
          }
        );
      }
    }
  }

  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
      new winston.transports.MongoDB({
        db: db_url,
        collection: log_collection_name,
        level: "info",
        // Removed deprecated useUnifiedTopology option
      }),
    ],
  });

  return logger;
}
