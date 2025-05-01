// controller.js:

// load all necessary packages
import processEnterEmailForm from "./services/processEnterEmailForm.js";
import processEnterCodeForm from "./services/processEnterCodeForm.js";

// controller function to return enter email form
export function getEnterEmailForm(req, res) {
  res.render("features/auth/form-enter-email");
}

// controller function to process the enter email form
export async function postEnterEmailForm(req, res) {
  console.debug("postEnterEmailForm");
  // call service method to process the email for step 1 of authentication
  let { data, template } = await processEnterEmailForm(req, res);

  // render data with the appropriate template
  res.render(template, data);
}

export async function postEnterCodeForm(req, res) {
  // call service method to process the email for step 2 of authentication
  let { data, template } = await processEnterCodeForm(
    req.tenant.services.dbConnection,
    req.body,
    res.locals
  );

  // render data with the appropriate template
  res.render(template, data);
}
