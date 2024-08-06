const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

const db_url = process.env.DB_URL;

function connect() {
  mongoose.connect(db_url);

  mongoose.connection.on('connected', () => {
    logger.info('success');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('an error ocoured');
  });
}

module.exports = connect;
