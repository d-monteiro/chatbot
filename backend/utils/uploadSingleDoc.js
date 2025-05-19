// utils/uploadSingleDoc.js
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { loadDocument } = require('./documentLoader');
const { processDocumentIntoChunks } = require('./textSplitter');
const { generateEmbeddingsBatch } = require('./gemini');
const { upsertVectors, getIndexStats } = require('./pinecone');

// Get filename from command line argument
const filename = process.argv[2];

if (!filename) {
  console.error('Please provide a filename as an argument.');
  console.error('Usage: node uploadSingleDoc.js "document.pdf"');
  process.exit(1);
}

// Process a single document
async function processSingleDocument(filename) {
  try {
    const documentsDir = path.join(__dirname, '../documents');
    const filePath = path.join(documentsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    
    console.log(`Processing document: ${filename}`);
    
    // Load the document
    const document = await loadDocument(filePath);
    console.log(`Document loaded: ${filename}`);
    
    // Process into chunks
    const chunks = processDocumentIntoChunks(document, 1000, 200);
    console.log(`Document split into ${chunks.length} chunks`);
    
    // Generate embeddings
    const textChunks = chunks.map(chunk => chunk.content);
    console.log('Generating embeddings...');
    const embeddings = await generateEmbeddingsBatch(textChunks);
    console.log(`Generated embeddings for ${embeddings.length} chunks`);
    
    // Prepare vectors for Pinecone
    const vectors = chunks.map((chunk, i) => {
      // Extract metadata fields and flatten them
      const flatMetadata = {};
      
      // Add chunk text preview
      flatMetadata.text_preview = chunk.content.slice(0, 100) + '...';
      // Add full text content
      flatMetadata.text = chunk.content;
      
      // Add all metadata fields as direct properties
      if (chunk.metadata) {
        Object.keys(chunk.metadata).forEach(key => {
          const value = chunk.metadata[key];
          // Ensure value is a simple type (string, number, boolean)
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            flatMetadata[key] = value;
          } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            flatMetadata[key] = value;
          } else {
            // Convert complex values to string
            flatMetadata[key] = JSON.stringify(value);
          }
        });
      }
      
      return {
        id: uuidv4(),
        values: embeddings[i],
        metadata: flatMetadata
      };
    });
    
    // Upload vectors to Pinecone
    console.log(`Uploading ${vectors.length} vectors to Pinecone...`);
    const batchSize = 50; // Smaller batch size to avoid size limits
    
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      console.log(`Uploading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(vectors.length/batchSize)} (${batch.length} vectors)...`);
      
      try {
        await upsertVectors(batch);
        console.log(`Batch ${Math.floor(i/batchSize) + 1} uploaded successfully.`);
      } catch (error) {
        console.error(`Error uploading batch ${Math.floor(i/batchSize) + 1}:`, error);
      }
    }
    
    console.log(`Successfully uploaded document: ${filename}`);
    
    // Get and display index statistics
    try {
      const stats = await getIndexStats();
      console.log('Pinecone Index Statistics:');
      console.log(JSON.stringify(stats, null, 2));
    } catch (error) {
      console.error('Error getting index stats:', error);
    }
    
  } catch (error) {
    console.error('Error processing document:', error);
    process.exit(1);
  }
}

// Run the script
processSingleDocument(filename);
