const express = require('express')
const controller = require('../controllers/users')

const routes = express.Router()

routes.get('/', controller.getUsers)

routes.get('/:id', controller.getUser)

routes.put('/:id', controller.updateUser)

routes.delete('/:id', controller.deleteUser)

module.exports = routes