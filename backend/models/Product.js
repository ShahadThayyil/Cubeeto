const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  whatsappNumber: {
    type: String,
    required: true
  },
  callNumber: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  thumbnail: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['sell', 'rent'],
    required: true
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

module.exports = mongoose.model('Product', ProductSchema);