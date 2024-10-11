const Joi = require('joi');

const createPostSchema = Joi.object({
  title: Joi.string().min(5).max(225).required(),
  description: Joi.string().min(5).max(225).required(),
  tags: Joi.array().items(Joi.string()).default([]),
  author: Joi.string().uuid({ version: 'uuidv4' }).required(),
  state: Joi.string().valid('published', 'draft').default('draft'),
  read_count: Joi.number().integer().min(0).default(0),
  reading_time: Joi.number().integer().min(0).default(0),
  body: Joi.string().required(),
});

module.exports = createPostSchema;
