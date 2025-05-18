// utils/pinecone.js
const { Pinecone } = require('@pinecone-database/pinecone');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

// Get index instance
const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

/**
 * Upsert documents to Pinecone
 * @param {Array} vectors - Array of vectors with id, values, and metadata
 * @returns {Promise} - Result of upsert operation
 */
async function upsertVectors(vectors) {
  try {
    // Batch upserts for better performance - max 100 per batch
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`Upserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(vectors.length/batchSize)}`);
    }
    return { success: true, count: vectors.length };
  } catch (error) {
    console.error('Error upserting vectors to Pinecone:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Query Pinecone for similar vectors
 * @param {Array} queryVector - The query embedding vector
 * @param {Number} topK - Number of results to return
 * @param {Object} filter - Optional metadata filter
 * @returns {Promise} - Query results
 */
async function querySimilar(queryVector, topK = 5, filter = {}) {
  try {
    const queryResult = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      filter
    });
    
    return queryResult.matches;
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    throw error;
  }
}

/**
 * Delete vectors from Pinecone
 * @param {Array} ids - Array of vector IDs to delete
 */
async function deleteVectors(ids) {
  try {
    await index.deleteMany(ids);
    return { success: true, count: ids.length };
  } catch (error) {
    console.error('Error deleting vectors from Pinecone:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get index statistics
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

module.exports = {
  index,
  upsertVectors,
  querySimilar,
  deleteVectors,
  getIndexStats
};