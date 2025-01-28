// assignLocalsMiddleware.js:

"use strict";

// middleware to assign locals used in rendering
function assignLocals(req, res, next) {
  // assign all values passed as local variables
  res.locals = {
    domain: "tworoadsmovement.com",
    SITE_TITLE: "Two Roads Movement",
    SITE_SLOGAN: "Helping you choose the next road in your life's journey",
    SITE_OWNER: "Two Roads Movement, llc",
    COPYRIGHT_YEAR: 2025,
  };

  // call the next middleware
  next();
}

// export the assign locals middleware
module.exports = assignLocals;
