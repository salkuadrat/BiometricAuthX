const { StatusCodes } = require('http-status-codes');
const { Sequelize, Post } = require('../models');

const {
  BAD_REQUEST,
  NO_CONTENT,
  INTERNAL_SERVER_ERROR
} = StatusCodes;

const iLike = Sequelize.Op.iLike;

exports.searchPost = async (req, res) => {
  let condition = {};

  // if url contains query params q, 
  // such as http://localhost:3000/posts?q=title
  // then returns all posts whose title contains q
  if (req.query.q) {
    condition = {
      where: { 
        title: { 
          [iLike]: `%${req.query.q}%` 
        }
      }
    };
  }

  try {
    const posts = await Post.findAll(condition);

    if (posts) {
      return res.json(posts);
    } else {
      return res.status(NO_CONTENT).json({
        message: 'Data not found'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

exports.findPost = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(BAD_REQUEST).json({
      message: 'No Post ID'
    });
  }

  try {
    const post = await Post.findByPk(id);

    if (post) {
      return res.json(post);
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

exports.createPost = async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const userId = req.userId;

  if (!title || !content) {
    return res.status(BAD_REQUEST).json({
      message: 'Incomplete Parameters'
    });
  }

  try {
    const post = await Post.create({ userId, title, content });

    if (post) {
      return res.json(post);
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Create post failed'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  
  if (!id || !title || !content) {
    return res.status(BAD_REQUEST).json({
      message: 'Incomplete Parameters'
    });
  }

  try {
    const data = await Post.update(req.body, { where: { id } });
    // data[0] contains affected rows
    const updated = data[0] > 0;

    if (updated) {
      return res.json({
        message: `Post ${id} is updated`
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: `Update post ${id} failed`
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

exports.deletePost = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(BAD_REQUEST).json({
      message: 'No Post ID'
    });
  }

  try {
    const data = await Post.destroy({ where: { id } });
    // data[0] contains affected rows
    const deleted = data[0] > 0;

    if (deleted) {
      return res.json({
        message: `Post ${id} is deleted`
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: `Delete post ${id} failed`
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

exports.deleteAllPost = async (req, res) => {
  try {
    const data = await Post.destroy({ truncate: true });
    // data[0] contains affected rows
    const deleted = data[0] > 0;

    if (deleted) {
      return res.json({
        message: 'All posts are deleted'
      });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Delete posts failed'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};