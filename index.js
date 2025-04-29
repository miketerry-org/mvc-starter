// index.js

import config from "./lib/config.js";
import { serverLog, setServerLog } from "./lib/utils/serverLog.js";
import createLogger from "./lib/utils/createLogger.js";

// Optional: Add more imports later when needed
// import createDBConnection from "./lib/utils/createDBConnection.js";
// import createMailer from "./lib/utils/createMailer.js";
// import Tenant from "./lib/utils/tenant.js";
// import Tenants from "./lib/utils/tenants.js";
// import createTenants from "./lib/utils/createTenants.js";

try {
  const logger = await createLogger(config);
  setServerLog(logger);
} catch (err) {
  console.error(`[Fatal] Failed to initialize logger: ${err.message}`);
  process.exit(1); // Ensure app does not continue in broken state
}
