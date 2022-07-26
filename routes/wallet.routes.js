const router = require('express').Router();
const {
  fundWallet,
  verifyTransactionStatus,
} = require('../controllers/wallet.controller');
const { verifyUserToken } = require('../middlewares/auth.middleware');

router.post('/wallet/fund', verifyUserToken, fundWallet);
router.post(
  '/wallet/verify-transaction/:reference',
  verifyUserToken,
  verifyTransactionStatus
);
module.exports = router;
