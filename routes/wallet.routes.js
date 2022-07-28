const router = require('express').Router();
const {
  fundWallet,
  verifyTransactionStatus,
  transferFunds,
} = require('../controllers/wallet.controller');
const { verifyUserToken } = require('../middlewares/auth.middleware');

router.post('/wallet/fund', verifyUserToken, fundWallet);
router.get(
  '/wallet/verify-transaction',
  verifyUserToken,
  verifyTransactionStatus
);
router.post('/wallet/transfer-fund', verifyUserToken, transferFunds);
module.exports = router;
