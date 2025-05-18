// fileUpload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { protect } = require('./middleware');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../documents'));
  },
  filename: (req, file, cb) => {
    // Use original filename to preserve file extension
    cb(null, file.originalname);
  }
});

// File filter to accept only PDF, DOCX, DOC, and TXT files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.pdf', '.docx', '.doc', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
  }
};

// Configure multer upload
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB size limit
});

// Handle file upload
router.post('/upload', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files were uploaded.'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    // Process the uploaded documents and update embeddings
    const uploadScriptPath = path.join(__dirname, '../utils/uploadDocs.js');
    exec(`node ${uploadScriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing documents: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        // Don't return an error here - we've already accepted the files
      }
      console.log(`stdout: ${stdout}`);
    });

    res.status(200).json({ 
      success: true, 
      message: 'Files uploaded successfully', 
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error in file upload route:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred during file upload'
    });
  }
});

// Get a list of uploaded documents
router.get('/documents', async (req, res) => {
  try {
    const documentsDir = path.join(__dirname, '../documents');
    const files = await fs.readdir(documentsDir);
    
    const documents = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.pdf', '.docx', '.doc', '.txt'].includes(ext);
      })
      .map(file => ({
        filename: file,
        path: `/documents/${file}`,
        size: fs.statSync(path.join(documentsDir, file)).size,
        uploadedAt: fs.statSync(path.join(documentsDir, file)).mtime
      }));
    
    res.status(200).json({ 
      success: true, 
      documents 
    });
  } catch (error) {
    console.error('Error getting document list:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while getting the document list'
    });
  }
});

module.exports = router;
