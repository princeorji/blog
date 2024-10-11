const Joi = require('joi');

const updatePostSchema = Joi.object({
  title: Joi.string().min(5).max(225).required().optional(),
  description: Joi.string().min(5).max(225).required().optional(),
  tags: Joi.array().items(Joi.string()).default([]).optional(),
  author: Joi.string().uuid({ version: 'uuidv4' }).required().optional(),
  state: Joi.string().valid('published', 'draft').default('draft').optional(),
  read_count: Joi.number().integer().min(0).default(0).optional(),
  reading_time: Joi.number().integer().min(0).default(0).optional(),
  body: Joi.string().required().optional(),
});

module.exports = updatePostSchema;
