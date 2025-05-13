const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure storage for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../frontend/public/uploads/products');
    createDirIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Configure storage for PDF notes
const noteStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../frontend/public/uploads/notes');
    createDirIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// File type validation
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed`));
    }
  };
};

// Create upload middleware
const uploadProduct = multer({
  storage: productStorage,
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png']),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

const uploadNote = multer({
  storage: noteStorage,
  fileFilter: fileFilter(['.pdf']),
  limits: { fileSize: 15 * 1024 * 1024 } // 10MB limit
});

module.exports = {
  uploadProduct,
  uploadNote
};