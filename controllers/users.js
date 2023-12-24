const Users = require('../models/users')

function getUsers(req, res) {
    Users.find()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

function getUser(req, res) {
    const id = req.params.id
    Users.findById(id)
        .then(user => {
            res.status(200).send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(404).send(err)
        })
}

function updateUser(req, res) {
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
}

function deleteUser(req, res) {
    const id = req.params.id
    Users.findByIdAndDelete(id)
        .then(user => {
            res.status(201).send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser
}