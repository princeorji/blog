const express = require('express');
const controller = require('../controllers/user');

const routes = express.Router();

routes.get('/profile', controller.profile);

module.exports = routes;
