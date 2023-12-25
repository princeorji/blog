const express = require('express')
const bodyParser = require('body-parser')
const connectdb = require('./config/mongodb')
const passport = require('passport')

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

app.use('/', authRoute)
app.use('/api/v1/posts', postRoute)
app.use('/api/v1/users', passport.authenticate('jwt', { session: false }), userRoute)

app.get('/', (req, res) => {
    res.send('Hello!')
})

//Error handler middleware
app.use((err, req, res, next) => {
    console.log(err)
    const errorStatus = err.status || 500
    res.status(errorStatus).json({ error: 'Internal Server Error' })
    next()
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})