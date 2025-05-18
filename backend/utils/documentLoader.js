// utils/documentLoader.js
const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const docxParser = require('docx-parser');

/**
 * Load a document from a file path and extract its text content
 * @param {string} filePath - Path to the document file
 * @returns {Promise<Object>} - Document object with content and metadata
 */
async function loadDocument(filePath) {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    const fileStat = await fs.stat(filePath);
    
    let content = '';
    
    // Extract text based on file type
    switch (fileExtension) {
      case '.pdf':
        content = await extractTextFromPdf(filePath);
        break;
      case '.docx':
        content = await extractTextFromDocx(filePath);
        break;
      case '.doc':
        content = await extractTextFromDoc(filePath);
        break;
      case '.txt':
        content = await fs.readFile(filePath, 'utf8');
        break;
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
    
    return {
      content,
      metadata: {
        fileName,
        filePath,
        fileType: fileExtension,
        fileSize: fileStat.size,
        lastModified: fileStat.mtime
      }
    };
  } catch (error) {
    console.error(`Error loading document ${filePath}:`, error);
    throw error;
  }
}

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromPdf(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

/**
 * Extract text from a DOCX file
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
}

/**
 * Extract text from a DOC file
 * @param {string} filePath - Path to the DOC file
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromDoc(filePath) {
  return new Promise((resolve, reject) => {
    docxParser.parseFile(filePath, (error, text) => {
      if (error) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
}

/**
 * Load multiple documents from a directory
 * @param {string} directoryPath - Path to directory containing documents
 * @param {Array<string>} fileExtensions - Array of file extensions to include
 * @returns {Promise<Array<Object>>} - Array of document objects
 */
async function loadDocumentsFromDirectory(directoryPath, fileExtensions = ['.pdf', '.docx', '.doc', '.txt']) {
  try {
    const files = await fs.readdir(directoryPath);
    const documentPromises = files
      .filter(file => fileExtensions.includes(path.extname(file).toLowerCase()))
      .map(file => loadDocument(path.join(directoryPath, file)));
    
    return Promise.all(documentPromises);
  } catch (error) {
    console.error('Error loading documents from directory:', error);
    throw error;
  }
}

module.exports = {
  loadDocument,
  loadDocumentsFromDirectory
};