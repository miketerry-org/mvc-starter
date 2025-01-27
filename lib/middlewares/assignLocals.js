// assignLocalsMiddleware.js:

"use strict";

// middleware to assign locals used in rendering
function assignLocals(req, res, next) {
  // assign all values passed as local variables
  // this will be pulled from a globals tenants cache
  let tenant = {
    domain: "www.disney.com",
    title: "Web Site Title",
    slogan: "Web Site Slogan",
    owner: "Web Site Owner",
    copyright: 2025,
  };

  // this will be assigned during the login process
  let user = {
    firstname: "Donald",
    lastname: "duck",
    email: "donald.duck@disney.com",
  };

  res.locals = {
    tenant,
    user,
    isLoggedIn: false,
  };

  // call the next middleware
  next();
}

// export the assign locals middleware
module.exports = assignLocals;
