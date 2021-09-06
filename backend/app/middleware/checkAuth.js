const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth');

const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST } = StatusCodes;

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
      if (error && error instanceof TokenExpiredError) {
        return res.status(BAD_REQUEST).json({
          message: 'Access token was expired'
        });
      }

      return res.status(BAD_REQUEST).json({
        message: 'Invalid Token'
      });
    }
  });
};