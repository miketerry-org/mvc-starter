// sendEmail.js

import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { serverLog } from "./serverLog.js";
import config from "../config.js";

/**
 * Renders a Handlebars template from file or inline string.
 *
 * @param {string} template - Filename or inline template string.
 * @param {Object} data - Data for template rendering.
 * @returns {Promise<string>}
 */
async function renderTemplate(template, data) {
  const looksLikeFile = template.endsWith(".hbs") || template.endsWith(".txt");
  const baseDir = config.path_email;

  const source = looksLikeFile
    ? await fs.readFile(path.join(baseDir, template), "utf-8")
    : template;

  const compiled = handlebars.compile(source);
  return compiled(data);
}

/**
 * Sends an email using a Nodemailer transport and Handlebars templates.
 *
 * @param {nodemailer.Transporter} transport - The configured transporter.
 * @param {Object} options - Email options and template paths.
 * @param {string} options.from - Sender address.
 * @param {string} options.to - Recipient address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.textTemplate - Filename or inline text template.
 * @param {string} [options.htmlTemplate] - Filename or inline HTML template.
 * @param {Object} options.data - Template data context.
 * @param {Object} [context] - Optional logging context (e.g. tenant_id).
 * @returns {Promise<Object>} - Result from nodemailer.
 */
export default async function sendEmail(transport, options, context = {}) {
  const { from, to, subject, textTemplate, htmlTemplate, data } = options;
  const label = context?.tenant_id ? `Tenant ${context.tenant_id}` : "Server";

  try {
    const text = await renderTemplate(textTemplate, data);
    const html = htmlTemplate
      ? await renderTemplate(htmlTemplate, data)
      : undefined;

    const mailOptions = {
      from,
      to,
      subject,
      text,
      ...(html && { html }),
    };

    const result = await transport.sendMail(mailOptions);

    serverLog.info(`${label}: Email sent successfully`, {
      to,
      subject,
      messageId: result.messageId,
    });

    return result;
  } catch (err) {
    serverLog.error(`${label}: Failed to send email`, {
      to,
      subject,
      error: err.message,
      stack: err.stack,
    });
    throw err;
  }
}
