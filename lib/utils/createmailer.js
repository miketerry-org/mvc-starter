// createMailer.js

import Confirm from "confirm-json";
import nodemailer from "nodemailer";
import { serverLog } from "./serverLog.js";

/**
 * Creates a configured Nodemailer transport for server or tenant use.
 *
 * @param {Object} config - Email configuration.
 * @returns {Promise<nodemailer.Transporter>}
 */
export default async function createNodeMailer(config) {
  try {
    const validate = new Confirm(config);
    validate
      .isString("mailer_host", undefined, 1, 255)
      .isInteger("mailer_port", undefined, 1, 65000)
      .isString("mailer_username", undefined, 1, 255, false)
      .isString("mailer_password", undefined, 1, 255, false)
      .isString("mailer_sender", undefined, 1, 255) // required
      .isInteger("tenant_id", undefined, 1, 1000000, false); // optional

    if (validate.errors.length > 0) {
      throw new Error("Mailer config invalid: " + validate.errors.join(", "));
    }

    const {
      mailer_host,
      mailer_port,
      mailer_username,
      mailer_password,
      tenant_id,
    } = config;

    const transportOptions = {
      host: mailer_host,
      port: mailer_port,
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    };

    if (mailer_username && mailer_password) {
      transportOptions.auth = {
        user: mailer_username,
        pass: mailer_password,
      };
    }

    const transport = nodemailer.createTransport(transportOptions);
    return transport;
  } catch (err) {
    const label = config?.tenant_id ? `Tenant ${config.tenant_id}` : "Server";
    serverLog.error(`${label}: Failed to initialize mailer`, { error: err });
    throw new Error(`${label}: ${err.message}`);
  }
}
