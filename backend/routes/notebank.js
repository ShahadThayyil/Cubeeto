const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const notebankController = require('../controllers/notebankController');
const { isAuthenticated } = require('../middlewares/auth');
const { uploadNote } = require('../middlewares/upload');

// NoteBank page
router.get('/', notebankController.renderNotebank);

// Upload note form page
router.get('/upload', isAuthenticated, notebankController.renderUploadForm);

// Upload note handle
router.post('/upload', isAuthenticated, 
  uploadNote.single('file'),
  [
    body('name').notEmpty().withMessage('Note name is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('college').notEmpty().withMessage('College is required'),
    body('stream').notEmpty().withMessage('Stream is required'),
    body('semester').notEmpty().withMessage('Semester is required')
  ],
  notebankController.uploadNote
);

// Download note
router.get('/download/:id', notebankController.downloadNote);

module.exports = router;