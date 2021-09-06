const express = require('express');
const router = express.Router();

const { 
  checkRegister, 
  checkAuth,
  checkRole 
} = require('../middleware');

const { checkRegisterParams, checkDuplicateUsername } = checkRegister;
const { verifyToken } = checkAuth;
const { isAdmin, isAuthor } =  checkRole;

const { 
  postController,
  userController,
  authController 
} = require('../controllers');

const { profile } = userController;

const { 
  register, 
  login,
  refreshBiometric,
  refreshToken 
} = authController;

const {
  searchPost,
  findPost,
  createPost,
  updatePost,
  deletePost,
  deleteAllPost
} = postController;

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

router.post(
  '/register', 
  [ checkRegisterParams, checkDuplicateUsername ], 
  register
);

router.post('/login', login);
router.post('/refreshbiometric', [ verifyToken ], refreshBiometric);
router.post('/refreshtoken', refreshToken);

module.exports = router;