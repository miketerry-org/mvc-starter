// config.js:

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import TopSecret from "topsecret";

let config = undefined;

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const envMode = process.env.NODE_ENV?.toLowerCase();
  console.debug("envMode", envMode);

  if (!envMode) {
    throw new Error(`The "NODE_ENV" environment variable is required!`);
  }

  let encryptKey;

  if (envMode === "prod") {
    encryptKey = process.env.ENCRYPT_KEY;
  } else {
    const keyFile = path.join(__dirname, "..", "config.key");

    if (!fs.existsSync(keyFile)) {
      throw new Error(
        `Configuration encryption key file not found! (${keyFile})`
      );
    }

    encryptKey = fs.readFileSync(keyFile, "utf-8");
  }

  if (!encryptKey || encryptKey.length !== 64) {
    throw new Error(`"ENCRYPT_KEY" must be exactly 64 characters`);
  }

  const topsecret = new TopSecret();
  topsecret.key = encryptKey;

  const configFile = path.join(__dirname, "..", "config.secure");
  if (!fs.existsSync(configFile)) {
    throw new Error(`Encrypted configuration file not found! (${configFile})`);
  }

  config = topsecret.decryptJSONFromFile(configFile);

  // Add environment flags
  config.isDevelopment = envMode === "dev";
  config.isProduction = envMode === "prod";
  config.isTesting = envMode === "test";
  config.env = envMode; // (optional) expose normalized env string
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

export default config;
