// utils/pinecone.js

// Load environment variables from .env file first
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Pinecone client
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.INDEX_NAME);

/**
 * Upsert vectors to the Pinecone index
 * @param {Array} vectors - Array of vectors to upsert
 * @returns {Promise} - Result of the upsert operation
 */
async function upsertVectors(vectors) {
  try {
    // For Pinecone v6, we need to directly pass the vectors array
    const result = await index.upsert(vectors);
    return result;
  } catch (error) {
    console.error("Error upserting vectors:", error);
    throw error;
  }
}

/**
 * Query similar vectors from the Pinecone index
 * @param {Array} queryVector - The query vector
 * @param {Number} topK - Number of results to return
 * @param {Object} filter - Filter to apply to the query
 * @returns {Promise} - Query results
 */
async function querySimilar(queryVector, topK = 2, filter = {}) {
  try {
    console.log(`Querying Pinecone with a ${queryVector.length}D vector, topK=${topK}`);
    
    const queryParams = {
      vector: queryVector,
      topK: topK,
      includeValues: true,
      includeMetadata: true
    };
    
    // Only add filter if it's not empty
    if (Object.keys(filter).length > 0) {
      queryParams.filter = filter;
      console.log('Using filter:', JSON.stringify(filter));
    }
    
    console.log('Query params:', JSON.stringify(queryParams, null, 2).substring(0, 200) + '...');
    
    console.log('Sending query to Pinecone...');
    const startTime = Date.now();
    const response = await index.query(queryParams);
    console.log(`Pinecone query took ${Date.now() - startTime}ms`);
    
    console.log(`Query returned ${response.matches ? response.matches.length : 0} matches`);
    if (response.matches && response.matches.length > 0) {
      console.log('First match score:', response.matches[0].score);
      console.log('First match metadata keys:', Object.keys(response.matches[0].metadata || {}));
      
      // Log a sample of the text content if available
      if (response.matches[0].metadata.text) {
        console.log('Text content sample:', response.matches[0].metadata.text.substring(0, 100) + '...');
      } else if (response.matches[0].metadata.text_preview) {
        console.log('Text preview sample:', response.matches[0].metadata.text_preview);
      }
    }
    
    return response.matches || [];
  } catch (error) {
    console.error("Error querying similar vectors:", error);
    throw error;
  }
}

/**
 * Get statistics for the Pinecone index
 * @returns {Promise<Object>} - Index statistics
 */
async function getIndexStats() {
  try {
    const stats = await index.describeIndexStats();
    return stats;
  } catch (error) {
    console.error('Error getting index stats:', error);
    throw error;
  }
}

// Example vectors
const exampleVectors = [
  {
     id: 'vec1', 
     values: Array(768).fill(0).map(() => Math.random() * 2 - 1), // Random normalized vectors
     metadata: { genre: 'drama' }
  },
  {
     id: 'vec2', 
     values: Array(768).fill(0).map(() => Math.random() * 2 - 1),
     metadata: { genre: 'action' }
  },
  {
     id: 'vec3', 
     values: Array(768).fill(0).map(() => Math.random() * 2 - 1),
     metadata: { genre: 'drama' }
  },
  {
     id: 'vec4', 
     values: Array(768).fill(0).map(() => Math.random() * 2 - 1),
     metadata: { genre: 'action' }
  }
];

// Export functions
module.exports = {
  upsertVectors,
  querySimilar,
  getIndexStats,
  exampleVectors,
  index
};