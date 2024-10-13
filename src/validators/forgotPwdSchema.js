const Joi = require('joi');

const forgotPwdSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

module.exports = forgotPwdSchema;
