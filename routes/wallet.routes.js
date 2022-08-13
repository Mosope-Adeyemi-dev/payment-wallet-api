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

router.post('/wallet/fund', verifyUserToken, fundWallet);
router.get(
  '/wallet/verify-transaction',
  verifyUserToken,
  verifyTransactionStatus
);
router.post('/wallet/transfer-fund', verifyUserToken, transferFunds);
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
  getTransactionDetail
);
router.get('/wallet/banks', verifyUserToken, getBanksList);
router.get('/wallet/bank/verify-account', verifyUserToken, verifyBankAccount);
router.post('/wallet/withdraw', verifyUserToken, withdrawFunds);
module.exports = router;
