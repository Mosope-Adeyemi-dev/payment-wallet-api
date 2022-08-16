const Joi = require('joi');

const inviteAdminValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};
const adminLoginValidation = async (field) => {
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

const adminSignupValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(1024),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    token: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  inviteAdminValidation,
  adminLoginValidation,
  adminSignupValidation,
};
