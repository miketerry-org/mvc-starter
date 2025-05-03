// controller.js

import processEnterEmailForm from "./services/processEnterEmailForm.js";
import processEnterCodeForm from "./services/processEnterCodeForm.js";

// GET: Return the "enter email" form partial
export function getEnterEmailForm(req, res) {
  res.render("features/auth/form-enter-email", { layout: false });
}

// POST: Handle the "enter email" form submission
export async function postEnterEmailForm(req, res) {
  console.debug("postEnterEmailForm");

  let { data, template } = await processEnterEmailForm(req, res);

  // Always render partials with layout: false
  res.render(template, { ...data, layout: false });
}

// POST: Handle the "enter code" form submission
export async function postEnterCodeForm(req, res) {
  let { data, template } = await processEnterCodeForm(
    req.tenant.services.dbConnection,
    req.body,
    res.locals
  );

  res.render(template, { ...data, layout: false });
}
