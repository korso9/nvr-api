const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  // assign header value to token variable
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  // If no token or token doesn't start with Bearer, return unauthorized
  if (!token && !req.headers['authorization'].startsWith('Bearer')) {
    return res.status(401).json({ success: false, msg: 'Invalid Token' });
  } else {
    // remove Bearer from token
    token = token.split(' ')[1];
    // verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      // if error verifying, return unauthorized
      if (err)
        return res.status(401).json({ success: false, msg: 'Invalid token' });
      // set user in request body
      req.user = await User.findById(decoded.id);
      // call next
      next();
    });
  }
};
