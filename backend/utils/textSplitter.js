// utils/textSplitter.js
/**
 * Split a long text into smaller chunks with some overlap
 * @param {string} text - The text to split
 * @param {number} chunkSize - Maximum size of each chunk (in characters)
 * @param {number} overlap - Overlap between chunks (in characters)
 * @returns {Array<string>} - Array of text chunks
 */
function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  if (!text || text.length <= chunkSize) {
    return [text];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Calculate end index for this chunk
    let endIndex = startIndex + chunkSize;
    
    // If we're not at the end of the document, try to find a good break point
    if (endIndex < text.length) {
      // Look for paragraph breaks, sentence breaks, or word breaks near the end of the chunk
      const paragraphBreak = text.lastIndexOf('\n\n', endIndex);
      const sentenceBreak = text.lastIndexOf('. ', endIndex);
      const wordBreak = text.lastIndexOf(' ', endIndex);
      
      // Choose the closest break point that's not too far back
      const minCutoff = endIndex - 200; // Don't go back more than 200 chars
      
      if (paragraphBreak > minCutoff) {
        endIndex = paragraphBreak + 2; // Include the paragraph break
      } else if (sentenceBreak > minCutoff) {
        endIndex = sentenceBreak + 2; // Include the period and space
      } else if (wordBreak > minCutoff) {
        endIndex = wordBreak + 1; // Include the space
      }
      // Otherwise just cut at the character level
    }
    
    // Extract the chunk and add to results
    chunks.push(text.slice(startIndex, endIndex));
    
    // Move start index for next chunk, accounting for overlap
    startIndex = endIndex - overlap;
    
    // Edge case: ensure we make progress
    if (startIndex <= 0 || startIndex >= text.length - 50) {
      break;
    }
  }

  return chunks;
}

/**
 * Process document metadata and content into chunks with metadata
 * @param {Object} document - Document with text content and metadata
 * @param {number} chunkSize - Maximum size of each chunk
 * @param {number} overlap - Overlap between chunks
 * @returns {Array<Object>} - Array of chunks with metadata
 */
function processDocumentIntoChunks(document, chunkSize = 1000, overlap = 200) {
  const { content, ...metadata } = document;
  const textChunks = splitTextIntoChunks(content, chunkSize, overlap);
  
  return textChunks.map((chunk, index) => ({
    content: chunk,
    metadata: {
      ...metadata,
      chunkIndex: index,
      totalChunks: textChunks.length
    }
  }));
}

module.exports = {
  splitTextIntoChunks,
  processDocumentIntoChunks
};
