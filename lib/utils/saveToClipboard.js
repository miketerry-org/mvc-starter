// saveToClipboard.js

import clipboard from "clipboardy";

/**
 * Copies a string to the system clipboard.
 * Only works on the machine running the Node.js process (e.g., during local development).
 *
 * @param {string} text - The text to copy to the clipboard.
 * @returns {Promise<void>}
 */
export default async function saveToClipboard(text) {
  if (typeof text !== "string") {
    throw new TypeError("Expected a string");
  }

  try {
    await clipboard.write(text);
    console.debug(`✅ Copied to clipboard: "${text}"`);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    throw err;
  }
}
