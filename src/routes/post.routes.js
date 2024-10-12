const express = require('express')
const passport = require('passport')
const controller = require('../controllers/post')

const routes = express.Router()

routes.post('', passport.authenticate('jwt', { session: false }), controller.create)
routes.get('', controller.posts)
routes.get('/:id', controller.getById)
routes.patch('/:id', passport.authenticate('jwt', { session: false }), controller.update)
routes.delete('/:id', passport.authenticate('jwt', { session: false }), controller.remove)

module.exports = routes