const Joi = require('joi')

const postSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(25)
        .required(),
    description: Joi.string()
        .min(10)
        .max(50)
        .optional(),
    tags: Joi.array()
        .optional(),
    author: Joi.string(),
    timestamp: Joi.date()
        .default(Date.now),
    state: Joi.string()
        .valid('published', 'draft')
        .default('draft')
        .optional(),
    body: Joi.string()
        .min(20)
        .required()
})


const userSchema = Joi.object({
    first_name: Joi.string()
        .max(25)
        .required(),
    last_name: Joi.string()
        .max(25)
        .required(),
    email: Joi.string()
        .email({ tlds: { allow: false } }),
    password: Joi.string()
        .min(5)
        .required()
})

async function postValidator(req, res, next) {
    const payLoad = req.body

    try {
        await postSchema.validateAsync(payLoad)
        next()
    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}

async function userValidator(req, res, next) {
    const payLoad = req.body

    try {
        await userSchema.validateAsync(payLoad)
        next()
    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}

module.exports = {
    postValidator,
    userValidator
}