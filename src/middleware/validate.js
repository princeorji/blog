const Joi = require('joi');
const Validators = require('../validators/index');

module.exports = function (validator) {
  if (!Validators.hasOwnProperty(validator)) {
    throw new Error(`'${validator}' validator is not exist`);
  }

  return async function (req, res, next) {
    try {
      const schema = Validators[validator];
      const validated = await schema.validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        return res.status(422).json({ message: err.message });
      }
      next(err);
    }
  };
};
