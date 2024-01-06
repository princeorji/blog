const logger = require('../config/logger')
const Users = require('../models/users')

const getUsers = async (req, res) => {
    try {
        const users = await Users.find()
        res.status(200).send(users)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)

        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        res.status(200).json(user)

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        if (req.user._id.toString() !== user._id.toString()) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        logger.info('User created successfully')
        res.status(200).json(user)

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id)

        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        if (req.user._id.toString() !== user._id.toString()) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        logger.info('User deleted successfully')
        res.status(200).json({ message: 'User deleted successfully' })

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const userProfile = async (req, res) => {
    try {
        const id = req.params.id
        const filter = req.query.q

        const user = await Users.findById(id).populate({
            path: 'posts',
            match: filter ? { state: filter } : undefined
        })

        const posts = user.posts
            .map((post) => ({
                _id: post._id,
                title: post.title,
                description: post.description,
                tags: post.tags,
                state: post.state,
                body: post.body
            }))

        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        if (req.user._id.toString() !== user._id.toString()) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        res.status(200).json({
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                post_count: user.post_count,
                posts: posts
            },
        })

    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    userProfile
}