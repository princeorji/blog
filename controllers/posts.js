const Posts = require('../models/posts')
const Users = require('../models/users')

const getPosts = async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).send(posts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)

        if (!post) {
            res.status(404).json({ error: 'Post not found' })
        } else {
            post.read_count += 1
            await post.save()
            res.status(200).json(post)
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const addPost = async (req, res) => {
    try {
        const { title, description, tags, state, body } = req.body

        const post = new Posts({
            title, description, tags, state, body, author: req.user._id
        })
        await post.save()

        // Increment the user's post_count in the user model and push the new post
        await Users.findByIdAndUpdate(
            post.author,
            { $inc: { post_count: 1 }, $push: { posts: post._id } },
            { new: true }
        )

        console.log('Post created successfully')
        res.status(201).json(post)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const updatePost = async (req, res) => {
    try {
        const post = req.body
        const query = await Posts.findByIdAndUpdate(req.params.id, post, { new: true })

        if (!query) {
            res.status(404).json({ error: 'Post not found' })
        } else {
            console.log('Post created successfully')
            res.status(200).json(query)
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Posts.findByIdAndDelete(req.params.id)

        if (!post) {
            res.status(404).json({ error: 'Post not found' })
        }

        // Decrement the post_count in the user model and pull the deleted post
        if (post.author) {
            await Users.findByIdAndUpdate(
                post.author,
                { $inc: { post_count: -1 }, $pull: { posts: post } },
                { new: true }
            )
        }

        console.log('Post deleted successfully')
        res.status(200).json({ message: `(${post.title})post deleted sucessfully` })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
}