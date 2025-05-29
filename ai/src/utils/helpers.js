const logger = require('./logger');

/**
 * Format the AI response to be sent back to the user
 * @param {string} response - Raw AI response
 * @returns {string} - Formatted response
 */
function formatResponse(response) {
  if (!response) return "I'm sorry, I couldn't generate a response.";
  
  // Get max response length from env or use default
  const maxLength = parseInt(process.env.MAX_RESPONSE_LENGTH || 500);
  
  // Trim and limit response length
  let formattedResponse = response.trim();
  
  // If response is too long, truncate it
  if (formattedResponse.length > maxLength) {
    formattedResponse = formattedResponse.substring(0, maxLength) + '...';
  }
  
  return formattedResponse;
}

/**
 * Display welcome message with bot information
 */
function displayWelcomeMessage() {
  const message = `
╔═════════════════════════════════╗
║       WhatsApp AI Bot v1.0      ║
╟─────────────────────────────────╢
║ • Status: Online                ║
║ • AI Model: ${process.env.HUGGINGFACE_MODEL || 'falcon-7b-instruct'} ║
║ • Commands: !help, !ask, !info  ║
╚═════════════════════════════════╝
  `.trim();
  
  console.log(message);
}

module.exports = {
  formatResponse,
  displayWelcomeMessage
};