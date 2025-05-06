// controller.js

import processEnterEmailForm from "./services/processEnterEmailForm.js";
import processEnterCodeForm from "./services/processEnterCodeForm.js";

// GET: Return the "enter email" form partial
export function getEnterEmailForm(req, res) {
  res.render("features/auth/form-enter-email");
}

// POST: Handle the "enter email" form submission
export async function postEnterEmailForm(req, res) {
  let { template, data } = await processEnterEmailForm(req, res);
  res.render(template, data);
}

// POST: Handle the "enter code" form submission
export async function postEnterCodeForm(req, res) {
  let { template, data } = await processEnterCodeForm(
    req.tenant.services.dbConnection,
    req.body,
    res.locals
  );
  res.render(template, data);
}
