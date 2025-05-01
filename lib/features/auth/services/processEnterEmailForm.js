// processEnterEmailForm.js:

// load all required modules
import confirm from "confirm-json";
import config from "../../../config.js";
import saveToClipboard from "../../../utils/saveToClipboard.js";
import AuthModel from "../model.js";
import sendAuthCodeEmail from "./sendAuthCodeEmail.js";

/**
 * Verifies the email in the request body.
 *
 * @param {Object} body - The request body containing the form data.
 * @param {Object} locals - The locals object for the current request.
 * @returns {Object} - An object containing the merged locals, body, and errors.
 */
function verifyEmailForm(body, locals) {
  // verify the email is in the body and is valid
  let errors = new confirm(body).isEmail("email", undefined).errors;

  // return the merging of body, locals and errors
  return { ...locals, ...body, errors };
}

/**
 * Processes the form where the user enters their email for authentication.
 * Validates the email, checks its existence in the database, and generates a verification code.
 *
 * @param {Object} db - The database connection object.
 * @param {Object} body - The request body containing the form data.
 * @param {Object} locals - The locals object for the current request.
 * @returns {Promise<Object>} - An object containing the data, errors, and template to render.
 */
export default async function processEnterEmailForm(req, res) {
  // declare local variables
  let tenant = req.tenant;
  let dbConnection = tenant.services.dbConnection;
  let body = req.body;
  let locals = res.locals;
  let auth = null;
  let data = null;
  let template = null;

  // perform body validation and merge locals into data
  data = verifyEmailForm(body, locals);

  // if one or more errors in body properties then require user to re-enter emil
  if (data.errors.length > 0) {
    template = "features/auth/form-enter-email";
    return { data, template };
  }

  // initialize AuthModel for tenant database
  const Auth = AuthModel(dbConnection);

  try {
    console.debug("processEnterEmailForm 6");
    // Check if the email already exists in the database
    auth = await Auth.findOne({ email: data.email });

    // if record not found then create new record
    if (!auth) {
      auth = new Auth({ email: data.email });
    }

    // Generate verification code, assign it internally to auth instance and return it inside data
    data.code = auth.createVerificationCode();

    // Save the user's record with the generated code
    await auth.save();

    // now send email to user with auth code
    await sendAuthCodeEmail(tenant, data.email, data.code);

    // if in development mode then copy auth code to clipboard
    if (config.isDevelopment) {
      await saveToClipboard(data.code);
    }

    // if no error then template is enter code form
    template = "features/auth/form-enter-code";
  } catch (err) {
    data.errors.push(err.message);
    template = "features/auth/form-enter-email";
  }

  // return data and template
  return { data, template };
}
