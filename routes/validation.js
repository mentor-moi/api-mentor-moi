const Joi = require("@hapi/joi")

// Register validation
const registerValidation = (data) => {
  const schema = {
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  }

  return Joi.validate(data, schema)
}

// login validation
const loginValidation = (data) => {
  const schema = {
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  }

  return Joi.validate(data, schema)
}

const forgotPasswordValidation = (data) => {
  const schema = {
    email: Joi.string().min(6).required().email(),
  }

  return Joi.validate(data, schema)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.forgotPasswordValidation = forgotPasswordValidation
