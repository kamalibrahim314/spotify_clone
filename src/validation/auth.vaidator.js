import joi from 'joi';


const signUpSchema = joi.object({
    name: joi.string().pattern(/^[a-zA-Z0-9ء-ي\s]{3,50}$/).trim().required()
        .messages({
            "string.pattern.base": "name is not valid",
            "any.required": "name is required"
        }),
    email: joi.string().email().required()
        .messages({
            "string.email": "email is not valid",
            "any.required": "email is required"
        }),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#^]{8,}$/).required()
        .messages({
            "string.pattern.base": "password is not valid",
            "any.required": "password is required"
        }),
}).required()


const signInSchema = joi.object({
    email: joi.string().email().required()
        .messages({
            "string.email": "email is not valid",
            "any.required": "email is required"
        }),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#^]{8,}$/).required()
        .messages({
            "string.pattern.base": "password is not valid",
            "any.required": "password is required"
        }),
}).required()

export {
    signUpSchema,
    signInSchema,
}
