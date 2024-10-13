const signup = require('./signupSchema');
const login = require('./loginSchema');
const createPost = require('./createPostSchema');
const updatePost = require('./updatePostSchema');
const forgotPwd = require('./forgotPwdSchema');
const resetPwd = require('./resetPwdSchema');

module.exports = {
  signup,
  login,
  forgotPwd,
  resetPwd,
  createPost,
  updatePost,
};
