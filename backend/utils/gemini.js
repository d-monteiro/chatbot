// utils/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model for chat/completion
const geminiProModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",  // Updated model name
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  }
});

// Model for embeddings
const embedModel = genAI.getGenerativeModel({ model: 'embedding-001' });

/**
 * Generate embeddings for a text using Gemini's embedding model
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<Array<number>>} - The embedding vector
 */
async function generateEmbedding(text) {
  try {
    const result = await embedModel.embedContent({
      content: { parts: [{ text }] },
    });
    
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * @param {Array<string>} texts - Array of texts to generate embeddings for
 * @returns {Promise<Array<Array<number>>>} - Array of embedding vectors
 */
async function generateEmbeddingsBatch(texts) {
  try {
    // Process in smaller batches to avoid rate limits
    const batchSize = 10;
    const embeddings = [];
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchPromises = batch.map(text => generateEmbedding(text));
      const batchResults = await Promise.all(batchPromises);
      embeddings.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return embeddings;
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw error;
  }
}

/**
 * Generate a response from Gemini using RAG with context
 * @param {string} query - User query
 * @param {Array<string>} contexts - Array of context strings from retrieval
 * @returns {Promise<string>} - Gemini's response
 */
async function generateResponse(query, contexts = []) {
  try {
    // Combine contexts into a single context string
    const context = contexts.join('\n\n');
    
    // Create prompt with context
    const prompt = `
        You are an AI assistant that provides accurate and helpful responses based on the provided context.

        Context:
        ${context}

        User Query: ${query}

        Provide a comprehensive answer to the user's query based on the context provided. 
        If the context doesn't contain relevant information to answer the query, acknowledge this limitation 
        and provide a general response based on your knowledge.
        `;

    const result = await geminiProModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    return result.response.text();
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    throw error;
  }
}

module.exports = {
  generateEmbedding,
  generateEmbeddingsBatch,
  generateResponse
};