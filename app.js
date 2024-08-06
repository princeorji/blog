const express = require('express');
const bodyParser = require('body-parser');
const connectdb = require('./config/mongodb');
const passport = require('passport');
const logger = require('./config/logger');

//Routes
const authRoute = require('./src/routes/auth.routes');
const postRoute = require('./src/routes/posts.routes');
const userRoute = require('./src/routes/users.routes');

require('dotenv').config();
require('./src/middlewares/auth'); // Signup and login authentication middleware
require('./config/passport');

const app = express();
const port = process.env.PORT;

// Connect to Mongodb Database
connectdb();

app.use(bodyParser.json());

app.use('/api/v1', authRoute);
app.use('/api/v1/posts', postRoute);
app.use(
  '/api/v1/users',
  passport.authenticate('jwt', { session: false }),
  userRoute
);

app.get('/', (req, res) => {
  res.send('Hello!');
});

// Error handler middleware
require('./src/middlewares/errorHandler');

app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`);
});
