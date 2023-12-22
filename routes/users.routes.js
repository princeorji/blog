const express = require('express')
const Users = require('../models/users')

const routes = express.Router()

routes.get('/', (req, res) => {
    Users.find()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})

routes.get('/:id', (req, res) => {
    const id = req.params.id
    Users.findById(id)
        .then(user => {
            res.status(200).send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(404).send(err)
        })
})

routes.post('/', (req, res) => {
    const user = req.body
    Users.create(user)
        .then(user => {
            res.status(201).send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
})

routes.put('/:id', (req, res) => {
    const id = req.params.id
    const user = req.body
    Users.findByIdAndUpdate(id, user, { new: true })
        .then(user => {
            res.status(201).send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
})

routes.delete('/:id', (req, res) => {
    const id = req.params.id
    Users.findByIdAndDelete(id)
        .then(user => {
            res.status(201).send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
})

module.exports = routes