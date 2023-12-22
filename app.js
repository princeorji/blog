const express = require('express')
const bodyParser = require('body-parser')
const connectdb = require('./db/mongodb')


//Routes
const postRoute = require('./routes/posts.routes')
const userRoute = require('./routes/users.routes')

require('dotenv').config()

const app = express()
const port = process.env.port

// Connect to Mongodb Database
connectdb()

app.use(bodyParser.json())

app.use('/api/v1/posts', postRoute)
app.use('/api/v1/users', userRoute)

app.get('/', (req, res) => {
    res.send('Hello!')
})

//Error handler middleware
app.use((err, req, res, next) => {
    console.log(err)
    const errorStatus = err.status || 500
    res.status(errorStatus).send(err.message)
    next()
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})