const Joi = require('joi');

const fundWalletValidation = async (field) => {
  const schema = Joi.object({
    amount: Joi.number().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const transferFundsValidation = async (field) => {
  const schema = Joi.object({
    amount: Joi.number().required(),
    comment: Joi.string(),
    recipientAccountTag: Joi.string().min(6).required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};
module.exports = {
  fundWalletValidation,
  transferFundsValidation,
};
