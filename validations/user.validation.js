const Joi = require('joi');

const setupTagValidation = async (field) => {
  const schema = Joi.object({
    accountTag: Joi.string().min(6).required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  setupTagValidation,
};
