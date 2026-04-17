const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, 'YOUR_SECRET_KEY');
    req.user = verified;
    next(); // Move to the next function
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};