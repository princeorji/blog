const Joi = require('joi');

const updatePostSchema = Joi.object({
  title: Joi.string().min(5).max(225).required().optional(),
  description: Joi.string().min(5).max(225).required().optional(),
  tags: Joi.array().items(Joi.string()).default([]).optional(),
  state: Joi.string().valid('published', 'draft').default('draft').optional(),
  body: Joi.string().required().optional(),
});

module.exports = updatePostSchema;
