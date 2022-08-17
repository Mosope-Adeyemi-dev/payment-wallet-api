const Wallet = require('../services/wallet.service');
const { responseHandler } = require('../utils/responseHandler');
const {
  fundWalletValidation,
  withdrawValidation,
  transferFundsValidation,
  setPinValidation,
  verifyBankAccountValidation,
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
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const wallet = new Wallet(req.email);
    const balance = await wallet.calculateWalletBalance(req.id);
    // if (balance) {
    return responseHandler(res, 'Wallet balance retrieved', 200, false, {
      balance,
      note: balance === 0 ? 'This user is broke lmao 👀' : null,
    });
  } catch (error) {
    console.log(error);
    return responseHandler(
      res,
      'Unable to retrieve wallet balance',
      500,
      true,
      ''
    );
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const wallet = new Wallet(req.email);
    console.log(req.id);
    const check = await wallet.getUserTransactions(req.id);
    if (check[0]) {
      return responseHandler(
        res,
        'Transaction history retrieved succesfully',
        200,
        false,
        check[1]
      );
    }
  } catch (error) {
    console.log(error);
    return responseHandler(
      res,
      'Unable to retrieve transaction history',
      500,
      true,
      ''
    );
  }
};

const getTransactionDetail = async (req, res) => {
  try {
    if (req.params.transactionId === undefined) {
      return responseHandler(
        res,
        'Invalid request. Include valid transaction ID',
        400,
        true,
        ''
      );
    }
    const wallet = new Wallet(req.email);
    const check = await wallet.getTransaction(req.params.transactionId);
    if (check[0]) {
      return responseHandler(
        res,
        'Transaction detail retrieved succesfully',
        200,
        false,
        check[1]
      );
    }
    return responseHandler(
      res,
      check[1] || 'Unable to retrieve transaction detail',
      404,
      true,
      ''
    );
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const getBanksList = async (req, res) => {
  try {
    const wallet = new Wallet(req.email);
    const check = await wallet.getPaystackBankLists();
    if (check[0]) {
      return responseHandler(
        res,
        'Bank list retrieved succesfully',
        200,
        false,
        check[1]
      );
    }
    return responseHandler(res, 'Unable to retrieve bank list', 400, true, '');
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const verifyBankAccount = async (req, res) => {
  try {
    const { details } = await verifyBankAccountValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }

    const wallet = new Wallet(req.email);
    const check = await wallet.resolveBankAccount(
      req.body.account_number,
      req.body.bank_code
    );

    if (check[0]) {
      return responseHandler(
        res,
        'Bank account details retrieved',
        200,
        false,
        check[1]
      );
    }
    return responseHandler(res, check[1], 400, true, '');
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const withdrawFunds = async (req, res) => {
  try {
    const { details } = await withdrawValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }
    const { fullName, accountNumber, bankCode, amount, reason, pin } = req.body;
    const wallet = new Wallet(req.email);
    const check = await wallet.initializeTransfer(
      amount,
      reason,
      fullName,
      accountNumber,
      bankCode,
      pin,
      req.id
    );
    if (check[0]) {
      return responseHandler(
        res,
        'Withdrawal request has been queued.',
        200,
        false,
        check[1]
      );
    }
    return responseHandler(res, check[1], 400, true, '');
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

module.exports = {
  fundWallet,
  verifyTransactionStatus,
  transferFunds,
  setupTransactionPin,
  getWalletBalance,
  getTransactionHistory,
  getTransactionDetail,
  getBanksList,
  verifyBankAccount,
  withdrawFunds,
};
