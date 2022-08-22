const router = require('express').Router();
const {
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
} = require('../controllers/wallet.controller');
const { verifyUserToken } = require('../middlewares/auth.middleware');
const { isVerifiedVendor } = require('../middlewares/vendor.middleware');

router.post('/wallet/fund', verifyUserToken, isVerifiedVendor, fundWallet);
router.get(
  '/wallet/verify-transaction',
  verifyUserToken,
  isVerifiedVendor,
  verifyTransactionStatus
);
router.post(
  '/wallet/transfer-fund',
  verifyUserToken,
  isVerifiedVendor,
  transferFunds
);
router.put('/wallet/pin/set', verifyUserToken, setupTransactionPin);
router.get('/wallet/balance', verifyUserToken, getWalletBalance);
router.get(
  '/wallet/transaction-history',
  verifyUserToken,
  getTransactionHistory
);
router.get(
  '/wallet/transaction-history/:transactionId',
  verifyUserToken,
  isVerifiedVendor,
  getTransactionDetail
);
router.get('/wallet/banks', verifyUserToken, isVerifiedVendor, getBanksList);
router.post(
  '/wallet/bank/verify-account',
  verifyUserToken,
  isVerifiedVendor,
  verifyBankAccount
);
router.post(
  '/wallet/withdraw',
  verifyUserToken,
  isVerifiedVendor,
  withdrawFunds
);
module.exports = router;
