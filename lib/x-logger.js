// logger.js

import config from "./config.js";
import createLogger from "./utils/createLogger.js";

// initialize the global logger used by server application
const logger = await createLogger(config);

export default logger;
