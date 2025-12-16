// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Simple auth middleware — check for token in Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now req.user.userId is available
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};