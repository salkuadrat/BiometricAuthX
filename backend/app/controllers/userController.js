const { Post, User } = require('../models');

const { 
  StatusCodes: { 
    NO_CONTENT, 
    INTERNAL_SERVER_ERROR 
  }
} = require('http-status-codes');

exports.profile = async (req, res) => {
  const username = req.params.username || req.username;
  
  try {
    const user = await User.findOne({ 
      where: { 
        username: username
      },
      attributes: [
        'id',
        'username',
        'email'
      ],
      include: [{
        model: Post,
        as: 'posts'
      }]
    });

    if (user) {
      return res.json(user);
    } else {
      return res.status(NO_CONTENT).json({
        message: 'Data not found'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};