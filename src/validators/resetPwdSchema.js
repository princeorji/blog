const Joi = require('joi');

const resetPwdSchema = Joi.object({
  reset_token: Joi.string().required(),
  newPassword: Joi.string().min(5).required(),
});

module.exports = resetPwdSchema;
