const express = require('express');
const controller = require('../controllers/auth');
const { userValidator } = require('../validators/validator');

const routes = express.Router();

routes.post('/signup', userValidator, controller.signup);

routes.post('/login', userValidator, controller.login);

module.exports = routes;
