const Joi = require('joi');

const setupTagValidation = async (field) => {
  const schema = Joi.object({
    accountTag: Joi.string().min(5).required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};
const getUserDetailsByUsernameValidation = async (field) => {
  const schema = Joi.object({
    accountTag: Joi.string().min(5).required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  setupTagValidation,
  getUserDetailsByUsernameValidation,
};
