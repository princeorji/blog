const Users = require('../models/users')

const getUsers = async (req, res) => {
    try {
        const users = await Users.find()
        res.status(200).send(users)
    } catch (error) {
        console.error(error)
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
        console.error(error)
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
            console.log(user._id)
            console.log(req.user._id)

            return
        }

        console.log('User created successfully')
        res.status(200).json(user)

    } catch (error) {
        console.error(error)
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

        console.log('User deleted successfully')
        res.status(200).json({ message: 'User deleted successfully' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser
}