const { getAIResponse } = require('../services/aiService');
const logger = require('../utils/logger');

/**
 * Set up bot commands
 * @param {Object} client - WhatsApp client instance
 * @returns {Object} - Commands object
 */
function setupCommands(client) {
  return {
    help: {
      description: 'Display available commands',
      execute: async (client, message) => {
        const helpText = `
*Available Commands:*
!help - Show this help message
!ask [question] - Ask a specific question to the AI
!info - Show information about this bot
!ping - Check if the bot is responding
        `.trim();
        
        await message.reply(helpText);
      }
    },
    
    ask: {
      description: 'Ask a specific question to the AI',
      execute: async (client, message) => {
        const question = message.body.substring(5).trim();
        
        if (!question) {
          await message.reply('Please provide a question after the !ask command.');
          return;
        }
        
        try {
          const response = await getAIResponse(question);
          await message.reply(response);
        } catch (error) {
          logger.error('Error with !ask command:', error);
          await message.reply('Sorry, I couldn\'t generate a response. Please try again later.');
        }
      }
    },
    
    info: {
      description: 'Show information about this bot',
      execute: async (client, message) => {
        const infoText = `
*WhatsApp AI Bot*
Version: 1.0.0
This bot uses AI to respond to your messages.

Send any message to chat with the AI, or use commands starting with ! for specific actions.
        `.trim();
        
        await message.reply(infoText);
      }
    },
    
    ping: {
      description: 'Check if the bot is responding',
      execute: async (client, message) => {
        await message.reply('Pong! 🏓 I\'m online and ready.');
      }
    }
  };
}

module.exports = { setupCommands };