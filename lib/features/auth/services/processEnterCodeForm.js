// processEnterCodeForm.js:

// load all required modules
import Confirm from "confirm-json";
import AuthModel from "../model.js";

/**
 * Verifies the format of the verification code in the request body.
 *
 * @param {Object} body - The request body containing the form data.
 * @param {Object} locals - The locals object for the current request.
 * @returns {Object} - An object containing the merged locals, body, and errors.
 */
function verifyCodeForm(body, locals) {
  // Regular expression for 3 digits + hyphen + 3 digits
  const pattern = /^[0-9]{3}-[0-9]{3}$/;

  // Verify the code is in the body and is valid
  let errors = new Confirm(body).isRegEx("code", undefined, pattern).errors;

  // Return the merged locals, body and errors
  let temp = { ...locals, ...body, errors };
  return temp;
}

// if error message then add to array in data and then return template and data object
function pack(template, data, message = undefined) {
  if (message) {
    data.errors.push(message);
  }
  return { template, data };
}

/**
 * Processes the form where the user enters the verification code.
 * Validates the code and handles the authentication process.
 *
 * @param {Object} db - The database connection object.
 * @param {Object} body - The request body containing the form data.
 * @param {Object} locals - The locals object for the current request.
 * @returns {Promise<Object>} - An object containing the data, errors, and template to render.
 */
export default async function processEnterCodeForm(dbConnection, body, locals) {
  // initialize local variables
  let auth = null;
  let data = null;
  let template = null;

  try {
    // Step 1: Validate the code format using the helper function
    data = verifyCodeForm(body, locals);

    // re-render entry code form if one or more errors found in body
    if (data.errors.length > 0) {
      return pack("features/auth/form-enter-code", data);
    }

    // Step 2: Initialize the Auth model for the tenant database
    const Auth = AuthModel(dbConnection);

    // Step 3: Retrieve the auth record based on the email passed
    auth = await Auth.findOne({ email: data.email });

    // Handle the case where the auth record doesn't exist
    if (!auth) {
      return pack(
        "features/auth/form-enter-email",
        data,
        "No authentication record found for this email."
      );
    }

    // Step 4: Increment login attempts and check if the account is locked
    await auth.incrementLoginAttempts();

    // Step 5: Try to verify the code using the AuthModel's verifyCode method
    await Auth.verifyCode(data.email, data.code);

    // If no errors, render dashboard
    return pack("features/client/dashboard/index", data);
  } catch (err) {
    if (err.message === "User not found") {
      return pack(
        "features/auth/form-enter-email",
        data,
        "No authentication record found for this email.  Please re-enter the email"
      );
    } else if (err.message === "Invalid verification code") {
      return pack(
        "features/auth/form-enter-code",
        data,
        "The verification code you entered is incorrect."
      );
    } else if (err.message === "Verification code has expired") {
      return pack(
        "features/auth/form-enter-email",
        data,
        "The verification code has expired. Please request a new code by signing in again."
      );
    } else if (err.message === "Email already verified") {
      return pack(
        "features/client/dashboard/index",
        data,
        "This email is already verified."
      );
    } else if (
      err.message === "Account is temporarily locked. Please try again later."
    ) {
      return pack(
        "features/auth/account-temporarily-locked",
        data,
        "Your account is temporarily locked due to multiple failed login attempts."
      );
    } else {
      // Catch any other unexpected errors and set template to unknown error
      return pack("unexpected-error", data, err.message);
    }
  }
}
