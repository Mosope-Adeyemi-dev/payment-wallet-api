const router = require('express').Router();
const { setupAccountTag } = require('../controllers/vendor.controller');
const { verifyVendorToken } = require('../middlewares/auth.middleware');

router.put(
  '/vendor/profile/account-tag/setup',
  verifyVendorToken,
  setupAccountTag
);
module.exports = router;
