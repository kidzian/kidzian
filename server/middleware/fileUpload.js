const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/images'),
    path.join(__dirname, '../uploads/pdfs')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize upload directories
createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    if (file.fieldname === 'image') {
      uploadPath = path.join(__dirname, '../uploads/images');
    } else if (file.fieldname === 'pdf') {
      uploadPath = path.join(__dirname, '../uploads/pdfs');
    } else {
      uploadPath = path.join(__dirname, '../uploads');
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  } else if (file.fieldname === 'pdf') {
    // Accept PDFs only
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 2 // Maximum 2 files per request
  }
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          message: 'File too large. Maximum size is 50MB.' 
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          message: 'Too many files. Maximum 2 files allowed.' 
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          message: 'Unexpected file field.' 
        });
      default:
        return res.status(400).json({ 
          message: `Upload error: ${err.message}` 
        });
    }
  } else if (err) {
    return res.status(400).json({ 
      message: err.message 
    });
  }
  next();
};

// Utility function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = {
  upload,
  handleUploadError,
  deleteFile,
  createUploadDirs
};
