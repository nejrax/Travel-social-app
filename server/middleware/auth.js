// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check for token in multiple header formats
  let token = req.headers['x-auth-token'];
  
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Support both userId and user.id formats
    req.user = {
      id: decoded.user?.id || decoded.userId,
      ...decoded
    };
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};