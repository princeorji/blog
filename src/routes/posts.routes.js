const express = require('express');
const controller = require('../controllers/posts');
const { postValidator } = require('../validators/validator');
const passport = require('passport');

const routes = express.Router();

routes.get('/', controller.getPosts);

routes.get('/:id', controller.getPost);

routes.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  postValidator,
  controller.addPost
);

routes.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  postValidator,
  controller.updatePost
);

routes.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  controller.deletePost
);

routes.post('/search', controller.searchPosts);

module.exports = routes;
