// scripts/uploadDocs.js
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { loadDocumentsFromDirectory } = require('./documentLoader');
const { processDocumentIntoChunks } = require('./textSplitter');
const { generateEmbeddingsBatch } = require('./gemini');
const { upsertVectors, getIndexStats } = require('./pinecone');

// Configuration for document processing
const DOCS_DIRECTORY = path.resolve(__dirname, '../documents');
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

/**
 * Process documents and upload to Pinecone
 */
async function processAndUploadDocuments() {
  try {
    console.log(`Loading documents from ${DOCS_DIRECTORY}...`);
    
    // Load documents from directory
    const documents = await loadDocumentsFromDirectory(DOCS_DIRECTORY);
    console.log(`Loaded ${documents.length} documents.`);
    
    // Process each document into chunks
    let allChunks = [];
    for (const document of documents) {
      console.log(`Processing document: ${document.metadata.fileName}`);
      const documentChunks = processDocumentIntoChunks(document, CHUNK_SIZE, CHUNK_OVERLAP);
      allChunks = [...allChunks, ...documentChunks];
    }
    
    console.log(`Created ${allChunks.length} total chunks from ${documents.length} documents.`);
    
    // Generate embeddings for all chunks
    console.log('Generating embeddings...');
    const textChunks = allChunks.map(chunk => chunk.content);
    const embeddings = await generateEmbeddingsBatch(textChunks);
    
    // Prepare vectors for Pinecone
    const vectors = allChunks.map((chunk, i) => {
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
    const result = await upsertVectors(vectors);
    
    if (result.success) {
      console.log(`Successfully uploaded ${result.count} vectors to Pinecone.`);
      
      // Get and display index statistics
      const stats = await getIndexStats();
      console.log('Pinecone Index Statistics:');
      console.log(JSON.stringify(stats, null, 2));
    } else {
      console.error('Failed to upload vectors to Pinecone:', result.error);
    }
  } catch (error) {
    console.error('Error in document processing pipeline:', error);
  }
}

// Run the script
processAndUploadDocuments().catch(console.error);