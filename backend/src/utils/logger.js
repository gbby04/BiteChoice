/**
 * Simple timestamp logger
 */

const log = (message, type = "info") => {
  const timestamp = new Date().toISOString();

  switch (type) {
    case "error":
      console.error(`[${timestamp}] ❌ ERROR: ${message}`);
      break;

    case "warn":
      console.warn(`[${timestamp}] ⚠️ WARN: ${message}`);
      break;

    default:
      console.log(`[${timestamp}] 📌 INFO: ${message}`);
      break;
  }
};

module.exports = log;
