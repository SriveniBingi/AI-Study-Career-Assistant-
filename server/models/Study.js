const mongoose = require('mongoose');

const StudySchema = new mongoose.Schema({
  // 🔗 This is the magic line: It connects the note to a specific User ID
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  originalText: String,
  summary: String,
  quiz: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Study', StudySchema);