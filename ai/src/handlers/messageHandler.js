const logger = require('../utils/logger');
const { getAIResponse } = require('../services/aiService');
const { formatResponse } = require('../utils/helpers');

/**
 * Process incoming messages and generate responses
 * @param {Object} client - WhatsApp client instance
 * @param {Object} message - Incoming message object
 * @param {Object} commands - Available commands
 */
async function processMessage(client, message, commands) {
  const chat = await message.getChat();
  const messageContent = message.body.trim();
  
  // Log incoming message
  logger.info(`Received message from ${chat.name || 'Unknown'}: ${messageContent}`);
  
  // Check if message is a command
  if (messageContent.startsWith('!')) {
    const commandName = messageContent.split(' ')[0].substring(1).toLowerCase();
    const command = commands[commandName];
    
    if (command) {
      logger.info(`Executing command: ${commandName}`);
      await command.execute(client, message);
      return;
    }
  }
  
  // Handle as regular message - send to AI
  try {
    // Show typing indicator
    chat.sendStateTyping();
    
    // Get AI response
    const aiResponse = await getAIResponse(messageContent);
    
    // Format and send response
    const formattedResponse = formatResponse(aiResponse);
    await message.reply(formattedResponse);
    
    logger.info(`Sent AI response to ${chat.name || 'Unknown'}`);
  } catch (error) {
    logger.error('Error getting AI response:', error);
    message.reply('Sorry, I couldn\'t generate a response at the moment. Please try again later.');
  }
}

module.exports = { processMessage };