const router = require('express').Router();
const {
  setupAccountTag,
  verifyAvailableUsername,
} = require('../controllers/user.controller');
const { verifyUserToken } = require('../middlewares/auth.middleware');

router.put('/user/profile/account-tag/setup', verifyUserToken, setupAccountTag);
router.get(
  '/user/profile/verify-account-tag/:username',
  verifyUserToken,
  verifyAvailableUsername
);
module.exports = router;
