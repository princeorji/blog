const express = require('express')
const controller = require('../controllers/users')
const { userValidator } = require('../validators/validator')

const routes = express.Router()

routes.get('/', controller.getUsers)

routes.get('/:id', controller.getUser)

routes.put('/:id', userValidator, controller.updateUser)

routes.delete('/:id', controller.deleteUser)

module.exports = routes