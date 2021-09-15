const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth');

const { 
  StatusCodes: { 
    BAD_REQUEST, 
    UNAUTHORIZED 
  }
} = require('http-status-codes');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(BAD_REQUEST).json({
      message: 'No Authentication Token'
    });
  }

  jwt.verify(token, secret, (error, data) => {
    if (data) {
      req.userId = data.id;
      req.username = data.username;
      next();
    } 
    else {
      if (error && error instanceof jwt.TokenExpiredError) {
        return res.status(UNAUTHORIZED).json({
          message: 'Access token was expired'
        });
      }

      return res.status(UNAUTHORIZED).json({
        message: 'Invalid Token'
      });
    }
  });
};