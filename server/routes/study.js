// routes/study.js
const express = require('express');
const router = express.Router();
const Study = require('../models/Study'); // Check capital 'S'

// GET history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // We use 'user' because your model in server.js uses 'user: userId'
    const history = await Study.find({ user: userId }).sort({ createdAt: -1 });
    res.json(history); // Note: Simplified response for the sidebar logic
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE session
router.delete('/delete-session/:id', async (req, res) => {
  try {
    await Study.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;