// assignLocalsMiddleware.js:

"use strict";

// middleware to assign locals used in rendering
function assignLocals(req, res, next) {
  // assign all values passed as local variables
  res.locals = {
    project_title: "Temporary Title",
    project_slogan: "Temporary Slogan",
    project_owner: "Temporary Owner",
    copyright_year: new Date().getFullYear(),
    isLoggedIn: false,
  };

  // call the next middleware
  next();
}

// export the assign locals middleware
module.exports = assignLocals;
