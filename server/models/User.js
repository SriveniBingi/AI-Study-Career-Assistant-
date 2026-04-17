const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true // Removes accidental spaces at the start/end
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // Ensures "User@Mail.com" is saved as "user@mail.com"
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
    // We will use bcrypt.hash() in the auth.js file before saving!
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);
