const { validationResult } = require('express-validator');
const Note = require('../models/Note');
const path = require('path');

// Render notebank page
exports.renderNotebank = async (req, res) => {
  try {
    const { subject, course, college, stream, semester } = req.query;
    
    // Build filter
    const filter = { isApproved: true };
    
    if (subject) filter.subject = subject;
    if (course) filter.course = course;
    if (college) filter.college = college;
    if (stream) filter.stream = stream;
    if (semester) filter.semester = semester;
    
    // Get filter options
    const subjects = await Note.distinct('subject', { isApproved: true });
    const courses = await Note.distinct('course', { isApproved: true });
    const colleges = await Note.distinct('college', { isApproved: true });
    const streams = await Note.distinct('stream', { isApproved: true });
    const semesters = await Note.distinct('semester', { isApproved: true });
    
    // Get notes
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 });
    
    res.render('notebank/index', { 
      title: 'NoteBank',
      notes,
      subjects,
      courses,
      colleges,
      streams,
      semesters,
      filters: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Render upload note form
exports.renderUploadForm = (req, res) => {
  res.render('notebank/upload', { title: 'Upload Notes' });
};

// Handle note upload
exports.uploadNote = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('notebank/upload', {
      title: 'Upload Notes',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    const { name, subject, course, college, stream, semester } = req.body;
    
    // Handle file upload
    if (!req.file) {
      req.flash('error_msg', 'Please upload a PDF file');
      return res.render('notebank/upload', {
        title: 'Upload Notes',
        formData: req.body
      });
    }
    
    // Create new note
    const note = new Note({
      name,
      subject,
      course,
      college,
      stream,
      semester,
      filePath: `/uploads/notes/${req.file.filename}`,
      user: req.session.user.id
    });
    
    await note.save();
    
    req.flash('success_msg', 'Note submitted for approval');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error occurred');
    res.redirect('/notebank/upload');
  }
};

// Download note
exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note || !note.isApproved) {
      return res.status(404).render('errors/404', { title: 'Note Not Found' });
    }
    
    // Increment download count
    note.downloadCount += 1;
    await note.save();
    
    // Generate file path
    const filePath = path.join(__dirname, '../../frontend/public', note.filePath);
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${note.name.replace(/\s+/g, '_')}.pdf`);
    
    // Send file
    res.download(filePath, `${note.name.replace(/\s+/g, '_')}.pdf`, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          req.flash('error_msg', 'Error downloading file');
          return res.redirect('/notebank');
        }
      }
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).render('errors/404', { title: 'Note Not Found' });
    }
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};