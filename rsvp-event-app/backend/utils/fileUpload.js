const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

// Allowed file types
const allowedFileTypes = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

// File size limit (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const fileExt = allowedFileTypes[file.mimetype] || 'bin';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const hashedName = crypto
      .createHash('md5')
      .update(uniqueSuffix)
      .digest('hex');
    
    cb(null, `${hashedName}.${fileExt}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only ${Object.keys(allowedFileTypes).join(
          ', '
        )} are allowed.`
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Middleware for handling file uploads
 * @param {string} fieldName - Name of the file input field
 * @param {number} maxCount - Maximum number of files to accept
 * @returns {Function} - Express middleware function
 */
const uploadFile = (fieldName, maxCount = 1) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName, maxCount);
    
    uploadHandler(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          });
        } else if (err.message.includes('Invalid file type')) {
          return res.status(400).json({
            success: false,
            error: err.message,
          });
        }
        
        logger.error('File upload error:', err);
        return res.status(500).json({
          success: false,
          error: 'Error uploading file',
        });
      }
      
      // If no files were uploaded, continue
      if (!req.files || req.files.length === 0) {
        return next();
      }
      
      // Add file information to the request object
      req.uploadedFiles = req.files.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
      }));
      
      next();
    });
  };
};

/**
 * Delete a file from the filesystem
 * @param {string} filePath - Path to the file to delete
 * @returns {Promise<boolean>} - True if file was deleted, false otherwise
 */
const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../../public', filePath);
    
    // Check if file exists
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Generate a secure URL for file access
 * @param {string} filePath - Path to the file
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {string} - Signed URL
 */
const generateSecureUrl = (filePath, expiresIn = 3600) => {
  // In a real application, you might want to use a CDN or storage service
  // that supports signed URLs (like AWS S3, Google Cloud Storage, etc.)
  // This is a simplified version that just returns the public URL
  
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  return `${baseUrl}${filePath}`;
};

module.exports = {
  upload,
  uploadFile,
  deleteFile,
  generateSecureUrl,
  allowedFileTypes,
  MAX_FILE_SIZE,
};
