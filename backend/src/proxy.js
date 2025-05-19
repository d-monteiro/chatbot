const { Pinecone } = require('@pinecone-database/pinecone');

/**
 * Initialize Pinecone client
 * @returns {Object} Pinecone client
 */
function initPinecone() {
  const config = {
    apiKey: process.env.PINECONE_API_KEY,
  };
  
  return new Pinecone(config);
}

module.exports = { initPinecone };