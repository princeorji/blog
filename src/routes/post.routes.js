const express = require('express')
const passport = require('passport')
const controller = require('../controllers/post')
const validate = require('../middleware/validate');

const routes = express.Router()

routes.post('', passport.authenticate('jwt', { session: false }), validate('createPost'), controller.create)
routes.get('', controller.posts)
routes.get('/:id', controller.getById)
routes.patch('/:id', passport.authenticate('jwt', { session: false }), validate('updatePost'), controller.update)
routes.delete('/:id', passport.authenticate('jwt', { session: false }), controller.remove)

module.exports = routes