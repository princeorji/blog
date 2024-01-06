const logger = require('../config/logger')
const Posts = require('../models/posts')
const Users = require('../models/users')

const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const order_by = req.query.order_by || 'asc'

        const skip = (page - 1) * limit

        const posts = await Posts.find({ state: 'published' }).populate({
            path: 'author',
            select: 'email post_count'
        })
            .skip(skip)
            .limit(limit)
            .sort({ read_count: order_by, timestamp: order_by })
            .exec()

        res.status(200).json({
            posts,
            page,
            limit
        })

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Posts.findById({ _id: req.params.id, state: 'published' })
            .populate({
                path: 'author',
                select: 'email post_count'
            })

        if (!post) {
            res.status(404).json({ error: 'Post not found' })
        } else {
            post.read_count += 1
            await post.save()
            res.status(200).json(post)
        }

    } catch (error) {
        logger.error(error)
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

        // Increment the user's post_count in the user model 
        await Users.findByIdAndUpdate(
            post.author,
            { $inc: { post_count: 1 } },
            { new: true }
        )

        logger.info('Post created successfully')
        res.status(201).json(post)

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const updatePost = async (req, res) => {
    try {
        const post = await Posts.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (!post) {
            res.status(404).json({ error: 'Post not found' })
            return
        }

        if (req.user._id.toString() !== post.author._id.toString()) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        logger.info('Post updated successfully')
        res.status(200).json(post)

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Posts.findByIdAndDelete(req.params.id)

        if (!post) {
            res.status(404).json({ error: 'Post not found' })
            return
        }

        if (req.user._id.toString() !== post.author._id.toString()) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        // Decrement the post_count in the user model 
        if (post.author) {
            await Users.findByIdAndUpdate(
                post.author,
                { $inc: { post_count: -1 } },
                { new: true }
            )
        }

        logger.info('Post deleted successfully')
        res.status(200).json({ message: `(${post.title})post deleted sucessfully` })

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const searchPosts = async (req, res) => {
    try {
        const searchTerm = req.query.q

        if (!searchTerm) {
            res.status(400).json({ error: 'Please provide a search term' })
            return
        }

        const posts = await Posts.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                // { 'author.first_name': { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(searchTerm, 'i')] } }
            ]
        })

        res.status(200).json(posts)

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost,
    searchPosts
}