const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);