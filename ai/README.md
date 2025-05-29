# WhatsApp AI Bot

A WhatsApp bot that can respond to users' questions using a GPT-like AI model via the Hugging Face Inference API.

## Features

- WhatsApp Web integration using whatsapp-web.js
- AI-powered responses using Hugging Face models
- Command system (!help, !ask, !info, !ping)
- Error handling and fallback responses
- Basic logging for interactions

## Prerequisites

- Node.js (v14 or higher)
- A Hugging Face API token
- A smartphone with WhatsApp installed

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Hugging Face API token:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_token
   HUGGINGFACE_MODEL=tiiuae/falcon-7b-instruct
   MAX_RESPONSE_LENGTH=500
   ENABLE_LOGGING=true
   ```
4. Start the bot:
   ```
   npm start
   ```
5. Scan the QR code with WhatsApp on your phone to authenticate

## Commands

- `!help` - Display available commands
- `!ask [question]` - Ask a specific question to the AI
- `!info` - Show information about this bot
- `!ping` - Check if the bot is responding

## Note

This bot uses the free tier of Hugging Face's Inference API, which may have rate limits. For production use, consider using a more robust solution.