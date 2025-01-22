// assignLocalsMiddleware.js:

"use strict";

// middleware to assign locals used in rendering
function assignLocals(req, res, next) {
  // assign all values passed as local variables
  res.locals = {
    project: {
      title: process.env.PROJECT_TITLE,
      slogan: process.env.PROJECT_SLOGAN,
      owner: process.env.PROJECT_OWNER,
      year: new Date().getFullYear(),
    },
    isLoggedIn: false,
  };

  // call the next middleware
  next();
}

// export the assign locals middleware
module.exports = assignLocals;
