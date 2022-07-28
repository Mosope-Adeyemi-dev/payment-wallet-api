const Wallet = require('../services/wallet.service');
const { responseHandler } = require('../utils/responseHandler');
const {
  fundWalletValidation,
  transferFundsValidation,
  setPinValidation,
} = require('../validations/wallet.validations');

const fundWallet = async (req, res) => {
  try {
    const { details } = await fundWalletValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }

    const wallet = new Wallet(req.email);
    const check = await wallet.initializePaystackCheckout(
      req.body.amount,
      req.id
    );

    if (check[0]) {
      return responseHandler(
        res,
        'Initialization successful',
        200,
        false,
        check[1]
      );
    }

    return responseHandler(res, 'Initialization unsuccessful', 400, true, '');
  } catch (error) {
    console.log(error);
    return responseHandler(
      res,
      'An error occured. Try again',
      500,
      true,
      error
    );
  }
};

const verifyTransactionStatus = async (req, res) => {
  try {
    if (req.query.reference === undefined) {
      return responseHandler(
        res,
        'Invalid request. Include reference ID',
        400,
        true,
        ''
      );
    }
    const wallet = new Wallet(req.email);
    const check = await wallet.verifyTransaction(req.query.reference);

    if (check[0]) {
      return responseHandler(
        res,
        'Transaction verification successful',
        200,
        false,
        check[1]
      );
    }

    return responseHandler(
      res,
      check[1] || 'Transaction verification failed',
      400,
      true,
      ''
    );
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const transferFunds = async (req, res) => {
  // transferFundsValidation
  try {
    const { details } = await transferFundsValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }
    const { pin, amount, recipientAccountTag, comment } = req.body;
    const wallet = new Wallet(req.email);
    const check = await wallet.transferFund(
      pin,
      amount,
      recipientAccountTag,
      comment,
      req.id
    );

    if (check[0]) {
      return responseHandler(
        res,
        'Funds transfer successful',
        200,
        false,
        check[1]
      );
    }

    return responseHandler(
      res,
      check[1] || 'Funds transfer failed',
      400,
      true,
      ''
    );
  } catch (error) {
    console.log(error);
    return responseHandler(
      res,
      'An error occured. Try again',
      500,
      true,
      error
    );
  }
};

const setupTransactionPin = async (req, res) => {
  try {
    const { details } = await setPinValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }

    const wallet = new Wallet(req.email);
    const check = await wallet.setPin(req.body.pin);
    if (check[0]) {
      return responseHandler(
        res,
        'Transaction pin set succesfully',
        200,
        false,
        check[1]
      );
    }
    return responseHandler(
      res,
      check[1] || 'Unable to set transaction pin',
      400,
      true,
      ''
    );
  } catch (error) {
    console.log(error);
    return responseHandler(
      res,
      'An error occured. Try again',
      500,
      true,
      error
    );
  }
};

module.exports = {
  fundWallet,
  verifyTransactionStatus,
  transferFunds,
  setupTransactionPin,
};
