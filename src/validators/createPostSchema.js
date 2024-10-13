const Joi = require('joi');

const createPostSchema = Joi.object({
  title: Joi.string().min(5).max(225).required(),
  description: Joi.string().min(5).max(225).required(),
  tags: Joi.array().items(Joi.string()).default([]).optional(),
  state: Joi.string().valid('published', 'draft').default('draft').optional(),
  body: Joi.string().required(),
});

module.exports = createPostSchema;
