// createMailTransport.js

import Confirm from "confirm-json";
import nodemailer from "nodemailer";
import { serverLog } from "./serverLog.js";

/**
 * Creates a Nodemailer transport configured for a tenant or the server.
 *
 * @param {Object} config - Email transport configuration.
 * @returns {Promise<nodemailer.Transporter>}
 */
export default async function createMailTransport(config) {
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

    const isMailhog = mailer_port === 1025;

    const transportOptions = {
      host: mailer_host,
      port: mailer_port,
      secure: !isMailhog, // false for MailHog, true for real SMTP (e.g., port 465)
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

    const label = tenant_id ? `Tenant ${tenant_id}` : "Server";
    serverLog.info(`${label}: Mail transport initialized`, {
      host: mailer_host,
      port: mailer_port,
      secure: transportOptions.secure,
    });

    return transport;
  } catch (err) {
    const label = config?.tenant_id ? `Tenant ${config.tenant_id}` : "Server";
    serverLog.error(`${label}: Failed to initialize mailer`, { error: err });
    throw new Error(`${label}: ${err.message}`);
  }
}
