// sendAuthCodeEmail.js

import sendEmail from "../../../utils/sendEmail.js";

/**
 * Sends a sign-in authentication code to the specified email address.
 *
 * @param {Object} tenant - Tenant-specific config, including mail transport and site info.
 * @param {string} email - The recipient's email address.
 * @param {string} code - The authentication code to send.
 */
export default async function sendAuthCodeEmail(tenant, email, code) {
  const mailTransport = tenant.services.mailTransport;

  const options = {
    from: tenant.site.site_support_email,
    to: email,
    subject: "Your sign in code",
    textTemplate: "auth_code_email.txt",
    htmlTemplate: "auth_code_email.hbs",
    data: {
      site_owner: tenant.site.site_owner,
      code,
    },
  };

  console.debug(`Sending sign-in code to: ${email}`);
  await sendEmail(mailTransport, options, { tenant_id: tenant.tenant_id });
}
