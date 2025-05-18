// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { generateEmbedding, generateResponse } = require('../utils/gemini');
const { querySimilar, getIndexStats } = require('../utils/pinecone');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes if they exist
try {
  const routes = require('./routes');
  app.use('/api', routes);
} catch (error) {
  console.log('Routes not loaded: ', error.message);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Basic route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gemini LLM Test</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .container { display: flex; flex-direction: column; gap: 20px; }
        textarea { width: 100%; height: 100px; padding: 10px; }
        button { padding: 10px 20px; background-color: #4285f4; color: white; border: none; cursor: pointer; }
        #response { white-space: pre-wrap; border: 1px solid #ccc; padding: 20px; min-height: 200px; }
      </style>
    </head>
    <body>
      <h1>Gemini LLM Test</h1>
      <div class="container">
        <textarea id="query" placeholder="Enter your query here..."></textarea>
        <button id="submit">Submit Query</button>
        <h2>Response:</h2>
        <div id="response"></div>
      </div>
      
      <script>
        document.getElementById('submit').addEventListener('click', async () => {
          const query = document.getElementById('query').value;
          if (!query) return;
          
          document.getElementById('response').textContent = 'Loading...';
          
          try {
            const response = await fetch('/api/direct-query', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query })
            });
            
            const data = await response.json();
            document.getElementById('response').textContent = data.response;
            
          } catch (error) {
            document.getElementById('response').textContent = 'Error: ' + error.message;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Simple direct query to Gemini without RAG
app.post('/api/direct-query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log(`Processing direct query: "${query}"`);
    
    // Generate response directly with Gemini without retrieval
    const response = await generateResponse(query, []);
    
    // Return just the response
    res.json({
      response
    });
  } catch (error) {
    console.error('Error processing direct query:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get index statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getIndexStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching index stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Main RAG endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { query, topK = 5, filter = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log(`Processing query: "${query}"`);
    
    // Generate embedding for the query
    console.log('Generating query embedding...');
    const queryVector = await generateEmbedding(query);
    
    // Query Pinecone for similar chunks
    console.log(`Retrieving top ${topK} most similar chunks...`);
    const similarChunks = await querySimilar(queryVector, topK, filter);
    
    // Extract text from the retrieved chunks
    const retrievedTexts = similarChunks.map(chunk => chunk.metadata.text || '');
    
    // Generate response with Gemini using the retrieved context
    console.log('Generating response with Gemini...');
    const response = await generateResponse(query, retrievedTexts);
    
    // Return the response along with the source chunks for reference
    res.json({
      response,
      sources: similarChunks.map(chunk => ({
        score: chunk.score,
        metadata: {
          fileName: chunk.metadata.fileName,
          filePath: chunk.metadata.filePath,
          chunkIndex: chunk.metadata.chunkIndex
        }
      }))
    });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`RAG server listening at http://localhost:${port}`);
  console.log(`- Test UI: http://localhost:${port}`);
  console.log(`- Health check: http://localhost:${port}/health`);
  console.log(`- Stats: http://localhost:${port}/api/stats`);
  console.log(`- Query endpoint: http://localhost:${port}/api/query (POST)`);
});

// Handle uncaught rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});