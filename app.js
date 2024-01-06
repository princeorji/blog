const express = require('express')
const bodyParser = require('body-parser')
const connectdb = require('./config/mongodb')
const passport = require('passport')
const logger = require('./config/logger')

//Routes
const authRoute = require('./routes/auth.routes')
const postRoute = require('./routes/posts.routes')
const userRoute = require('./routes/users.routes')

require('dotenv').config()
require('./middlewares/auth') // Signup and login authentication middleware
require('./config/passport')

const app = express()
const port = process.env.port

// Connect to Mongodb Database
connectdb()

app.use(bodyParser.json())

app.use('/api/v1', authRoute)
app.use('/api/v1/posts', postRoute)
app.use('/api/v1/users', passport.authenticate('jwt', { session: false }), userRoute)

app.get('/', (req, res) => {
    res.send('Hello!')
})

//Error handler middleware
app.use((err, req, res, next) => {
    logger.error(err.message)
    res.status(500).json({ error: 'Internal Server Error' })
    next()
})

app.listen(port, () => {
    logger.info(`Server listening at http://localhost:${port}`)
})