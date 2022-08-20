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
    pin: Joi.string().min(4).max(4).required(),
    amount: Joi.number().required(),
    comment: Joi.string(),
    recipientAccountTag: Joi.string().min(5).required(),
    senderTag: Joi.string().min(5).required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const setPinValidation = async (field) => {
  const schema = Joi.object({
    pin: Joi.string().min(4).max(4).required(),
    confirmPin: Joi.ref('pin'),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const verifyBankAccountValidation = async (field) => {
  const schema = Joi.object({
    bank_code: Joi.string().required(),
    account_number: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const withdrawValidation = async (field) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    bankCode: Joi.string().required(),
    pin: Joi.string().min(4).max(4).required(),
    reason: Joi.string(),
    amount: Joi.number().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  setPinValidation,
  withdrawValidation,
  fundWalletValidation,
  transferFundsValidation,
  verifyBankAccountValidation,
};
