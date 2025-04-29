// serverLog.js (ES Modules version)

// Default logger is the global console object
let _serverLog = console;

/**
 * Validates that a logger object implements required log methods
 */
function isValidLogger(value) {
  const requiredMethods = ["log", "info", "warn", "error"];
  return (
    value &&
    typeof value === "object" &&
    requiredMethods.every(method => typeof value[method] === "function")
  );
}

/**
 * Sets the global logger to a custom implementation.
 * This should only be called once, typically at app startup.
 */
export function setServerLog(value) {
  if (isValidLogger(value)) {
    _serverLog = value;
  } else {
    console.debug(
      "[serverLog] Invalid logger provided. Falling back to console."
    );
    _serverLog = console;
  }
}

/**
 * Provides read-only access to the current server logger
 */
export const serverLog = new Proxy(
  {},
  {
    get(_, prop) {
      return typeof _serverLog[prop] === "function"
        ? _serverLog[prop].bind(_serverLog)
        : undefined;
    },
  }
);
