// libsql-orm:

"use strrict";

// load all required packages
const { Database } = require("libsql-orm");
const confirm = require("confirm-env");

// perform all setup for database
function setup(core) {
  // ensure all required environment variables are defined
  confirm("DATABASE_URL").isDefined();

  // define a new database connection
  const db = new Database();

  // connect to the database
  db.connect(
    process.env.DATABASE_URL,
    "",
    ""
    //process.env.DATABASE_CYPHER,
    //process.env.DATABASE_KEY
  );

  // bind the connected database to the core object
  core.bindDB(db);
}

// export the setup function
module.exports = { setup };
