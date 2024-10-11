const express = require('express');
const passport = require('passport')
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes')

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/users', passport.authenticate('jwt', { session: false }), userRoutes);

module.exports = routes;
