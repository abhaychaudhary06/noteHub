const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ['Ideas', 'Learning', 'Backend', 'Personal', 'Other'],
    default: 'Other'
  },

  isPinned: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);