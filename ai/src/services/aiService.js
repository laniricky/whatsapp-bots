const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Get response from Hugging Face AI model
 * @param {string} message - User message
 * @returns {Promise<string>} - AI generated response
 */
async function getAIResponse(message) {
  try {
    const model = process.env.HUGGINGFACE_MODEL || 'tiiuae/falcon-7b-instruct';
    const maxLength = parseInt(process.env.MAX_RESPONSE_LENGTH || 500);
    
    logger.info(`Sending message to AI model: ${model}`);
    
    const response = await axios({
      method: 'POST',
      url: `https://api-inference.huggingface.co/models/${model}`,
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs: message,
        parameters: {
          max_new_tokens: maxLength,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      },
      timeout: 30000 // 30 second timeout
    });
    
    // Check response format and extract the text
    if (response.data && response.data[0] && response.data[0].generated_text) {
      const generatedText = response.data[0].generated_text;
      
      // Remove the original prompt if it's included in the response
      const cleanedResponse = generatedText.replace(message, '').trim();
      
      // Limit response length to prevent spamming
      return cleanedResponse.length > maxLength 
        ? cleanedResponse.substring(0, maxLength) + '...' 
        : cleanedResponse;
    }
    
    // Fallback in case of unexpected response format
    return "I'm sorry, I couldn't generate a proper response.";
    
  } catch (error) {
    logger.error('AI service error:', error.message);
    
    // Check for specific error types
    if (error.response) {
      logger.error(`API responded with status ${error.response.status}`);
      if (error.response.status === 429) {
        return "I'm receiving too many requests right now. Please try again later.";
      }
    } else if (error.request) {
      logger.error('No response received from AI service');
      return "I couldn't reach my AI service. Please check your internet connection or try again later.";
    }
    
    throw new Error('Failed to get AI response');
  }
}

module.exports = { getAIResponse };