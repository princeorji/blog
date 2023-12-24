const Posts = require('../models/posts')

function getPosts(req, res) {
    Posts.find()
        .then(posts => {
            res.send(posts)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

function getPost(req, res) {
    const id = req.params.id
    Posts.findById(id)
        .then(post => {
            res.status(200).send(post)
        })
        .catch(err => {
            console.log(err)
            res.status(404).send(err)
        })
}

function addPost(req, res) {
    const post = req.body
    Posts.create(post)
        .then(post => {
            res.status(201).send(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
}

function updatePost(req, res) {
    const id = req.params.id
    const post = req.body
    Posts.findByIdAndUpdate(id, post, { new: true })
        .then(post => {
            res.status(201).send(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
}

function deletePost(req, res) {
    const id = req.params.id
    Posts.findByIdAndDelete(id)
        .then(post => {
            res.status(201).send(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
}

module.exports = {
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
}