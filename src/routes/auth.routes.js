const express = require('express');
const controller = require('../controllers/auth');
const validate = require('../middleware/validate');

const routes = express.Router();

routes.post('/signup', validate('signup'), controller.signup);
routes.get('/verify-email/:token', controller.verifyEmail);
routes.post('/login', validate('login'), controller.login);

module.exports = routes;
