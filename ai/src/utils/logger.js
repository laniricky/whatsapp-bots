/**
 * Simple logging utility
 */
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  success: 2,
  warn: 3,
  error: 4
};

// Get current log level from environment or default to info
const currentLevel = process.env.LOG_LEVEL || 'info';
const enableLogging = process.env.ENABLE_LOGGING !== 'false';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  debug: '\x1b[90m', // Gray
  info: '\x1b[36m',  // Cyan
  success: '\x1b[32m', // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  bold: '\x1b[1m'
};

/**
 * Format timestamp for logs
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Log a message if level is sufficient
 * @param {string} level - Log level
 * @param {string} message - Message to log
 * @param {any} data - Additional data to log
 */
function log(level, message, data = null) {
  if (!enableLogging) return;
  
  // Check if we should log this level
  if (LOG_LEVELS[level] < LOG_LEVELS[currentLevel]) return;
  
  const timestamp = getTimestamp();
  const prefix = `${colors[level]}[${timestamp}] [${level.toUpperCase()}]${colors.reset}`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

// Export logging methods
module.exports = {
  debug: (message, data) => log('debug', message, data),
  info: (message, data) => log('info', message, data),
  success: (message, data) => log('success', message, data),
  warn: (message, data) => log('warn', message, data),
  error: (message, data) => log('error', message, data)
};