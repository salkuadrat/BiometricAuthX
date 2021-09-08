const { Post } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { FORBIDDEN, INTERNAL_SERVER_ERROR } = StatusCodes;

exports.isAdmin = async (req, res, next) => {
  if (req.username === 'admin') {
    next();
  } else {
    return res.status(FORBIDDEN).json({
      message: 'Not authorized. Access admin only.'
    });
  }
};

exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);

    if (post && post.userId === req.userId) {
      next();
    } else {
      return res.status(FORBIDDEN).json({
        message: 'Not authorized.'
      });
    }
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};