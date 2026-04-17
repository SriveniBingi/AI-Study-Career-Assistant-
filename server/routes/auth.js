const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 🟢 3. FORGOT PASSWORD ROUTE (New!)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Verify user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "No account found with this email" });
    }

    // Hash the new password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update and save
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error during password reset");
  }
});

module.exports = router;