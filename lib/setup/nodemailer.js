// nodemailer.js: initializes nodemailer using environment variables

"use strict";

// load all necessary modules
const nodemailer = require("nodemailer");
const confirm = require("confirm-env");

// global nodemailer transport instance
let _transport = null;

// called bac function when email is finish sending
function sendEmailCallBack(err, info) {
  // log any error
  if (err) {
    console.error("SendEmail", err);
  } else if (core.isDevelopment) {
    // if in development mode then display email message
    console.info("email sent", info);
  }

  // return true if no error
  return !err;
}

// create an emailer object
function createEmailer() {
  // if not already done, initialize the global nodemailer smtp transport
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === 465,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // return the emailer object
  return {
    // function send email
    send: (message) => {
      // send the email message
      console.debug("message", message);
      _transport.sendMail(message, sendEmailCallBack);
    },
  };
}

// function called by core to setup the emailer using nodemailer
function setup(core) {
  // ensure all smtp related required environment variables are defined
  confirm("SMTP_HOST").isDefined;
  confirm("SMTP_PORT").isDefined;
  confirm("SMTP_USERNAME").isDefined;
  confirm("SMTP_PASSWORD").isDefined;

  // create and bind the emailer to the  core global object
  core.bindEmailer(createEmailer());
}

// export the setup function
module.exports = { setup };
