const router = require('express').Router();
const {
  setupAccountTag,
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
router.get(
  '/user/profile/find-by-username',
  verifyUserToken,
  getUserDetailsByUsername
);
module.exports = router;
