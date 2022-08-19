const router = require('express').Router();
const {
  setupAccountTag,
  getAccountDetails,
  verifyAvailableUsername,
  getUserDetailsByUsername,
} = require('../controllers/user.controller');
const { verifyUserToken } = require('../middlewares/auth.middleware');

router.put('/user/profile/account-tag/setup', verifyUserToken, setupAccountTag);
router.get(
  '/user/profile/verify-account-tag/:username',
  verifyUserToken,
  verifyAvailableUsername
);
router.post(
  '/user/profile/find-by-username',
  verifyUserToken,
  getUserDetailsByUsername
);
router.get('/user/profile/me', verifyUserToken, getAccountDetails);
module.exports = router;
