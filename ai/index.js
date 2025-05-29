// Main entry point for the WhatsApp AI Bot
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const dotenv = require('dotenv');
const path = require('path');

// Import modules
const { processMessage } = require('./src/handlers/messageHandler');
const { setupCommands } = require('./src/handlers/commandHandler');
const logger = require('./src/utils/logger');
const { displayWelcomeMessage } = require('./src/utils/helpers');

// Load environment variables
dotenv.config();

// Initialize client
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, '.wwebjs_auth')
  }),
  puppeteer: {
    args: ['--no-sandbox']
  }
});

// Set up command handlers
const commands = setupCommands(client);

// Register event handlers
client.on('qr', (qr) => {
  logger.info('QR Code received. Scan to authenticate:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  logger.success('WhatsApp client is ready!');
  displayWelcomeMessage();
});

client.on('authenticated', () => {
  logger.info('Client authenticated successfully');
});

client.on('auth_failure', (msg) => {
  logger.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  logger.warn('Client was disconnected:', reason);
});

// Message handler
client.on('message', async (message) => {
  try {
    // Skip messages from the bot itself
    if (message.fromMe) return;
    
    // Process message (check for commands or handle as normal message)
    await processMessage(client, message, commands);
  } catch (error) {
    logger.error('Error handling message:', error);
    message.reply('Sorry, I encountered an error processing your message.');
  }
});

// Initialize the client
client.initialize();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  await client.destroy();
  process.exit(0);
});