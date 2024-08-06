const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
  next();
};

module.exports = errorHandler;
