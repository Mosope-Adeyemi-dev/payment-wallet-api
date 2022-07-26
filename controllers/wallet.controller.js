const Wallet = require('../services/wallet.service');
const { responseHandler } = require('../utils/responseHandler');
const { fundWalletValidation } = require('../validations/wallet.validations');

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
    // const { details } = await fundWalletValidation(req.body);
    // if (details) {
    //   let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
    //   return responseHandler(res, allErrors, 400, true, '');
    // }

    const wallet = new Wallet(req.email);
    const check = await wallet.verifyTransaction(req.params.reference);

    if (check[0]) {
      return responseHandler(
        res,
        'verified transaction by reference',
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
module.exports = {
  fundWallet,
  verifyTransactionStatus,
};
