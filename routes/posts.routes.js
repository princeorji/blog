const express = require('express')
const controller = require('../controllers/posts')

const routes = express.Router()

routes.get('/', controller.getPosts)

routes.get('/:id', controller.getPost)

routes.post('/', controller.addPost)

routes.put('/:id', controller.updatePost)

routes.delete('/:id', controller.deletePost)

module.exports = routes