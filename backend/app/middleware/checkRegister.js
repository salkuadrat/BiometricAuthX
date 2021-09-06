const { User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

exports.checkRegisterParams = (req, res, next) => {
  const { 
    username, 
    email, 
    password 
  } = req.body;

  if (username && password && email) {
    next();
  } else {
    return res.status(BAD_REQUEST).json({
      message: 'Incomplete params'
    });
  }
};

exports.checkDuplicateUsername = async (req, res, next) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ 
      where : { username: username } 
    });

    if (user) {
      return res.status(BAD_REQUEST).json({ 
        message: `Username ${username} is already taken` 
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};