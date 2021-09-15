const express = require('express');
const router = express.Router();

const { 
  checkRegister: { 
    checkRegisterParams, 
    checkDuplicateUsername 
  }, 
  checkAuth: { 
    verifyToken 
  }, 
  checkRole: { 
    isAdmin, 
    isAuthor 
  } 
} = require('../middleware');

const { 
  authController: { 
    register, 
    login,
    refreshBiometric,
    refreshToken 
  },
  userController: { 
    profile 
  },
  postController: {
    searchPost,
    findPost,
    createPost,
    updatePost,
    deletePost,
    deleteAllPost
  }
} = require('../controllers');

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.get('/posts', searchPost);
router.get('/posts/:id', findPost);
router.post('/posts', [ verifyToken ], createPost);
router.put('/posts/:id', [ verifyToken, isAuthor ],  updatePost);
router.delete('/posts/:id', [ verifyToken, isAuthor ],  deletePost);
router.delete('/posts', [ verifyToken, isAdmin ], deleteAllPost);

router.get('/profile', [ verifyToken ], profile);
router.get('/profile/:username', profile);

router.post('/register', [ 
  checkRegisterParams, 
  checkDuplicateUsername 
], register);

router.post('/login', login);
router.post('/refreshbiometric', [ verifyToken ], refreshBiometric);
router.post('/refreshtoken', refreshToken);

module.exports = router;