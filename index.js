// index.js

import config from "./lib/config.js";
import { serverLog, setServerLog } from "./lib/utils/serverLog.js";
import createLogger from "./lib/utils/createLogger.js";
import createExpress from "./lib/utils/createExpress.js";
import createServer from "./lib/utils/createServer.js";

try {
  // create and assign the server logger
  setServerLog(await createLogger(config));

  // initialize the express application
  const app = await createExpress(config);

  // add all features
  app.addFeatures(["about", "auth", "contact", "home", "support"]);

  // create the http or https server
  const server = await createServer(app);

  // start listening for requests
  server.listen(config.port, () => {
    console.debug(`Server is listening on port ${config.port}`);
  });
} catch (err) {
  console.error(`[Fatal] Failed to initialize logger: ${err.message}`);
  process.exit(1); // Ensure app does not continue in broken state
}
