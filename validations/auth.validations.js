const Joi = require('joi');

const loginValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(1024),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const userSignupValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(1024),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const vendorSignupValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(1024),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    offeredService: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  loginValidation,
  userSignupValidation,
  vendorSignupValidation,
};
