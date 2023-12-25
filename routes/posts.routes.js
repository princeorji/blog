const express = require('express')
const controller = require('../controllers/posts')
const { postValidator } = require('../validators/validator')

const routes = express.Router()

routes.get('/', controller.getPosts)

routes.get('/:id', controller.getPost)

routes.post('/', postValidator, controller.addPost)

routes.put('/:id', postValidator, controller.updatePost)

routes.delete('/:id', controller.deletePost)

module.exports = routes