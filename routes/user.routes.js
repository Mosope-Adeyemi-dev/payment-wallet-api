const router = require('express').Router();
const { setupAccountTag } = require('../controllers/user.controller');
const { verifyUserToken } = require('../middlewares/auth.middleware');

router.put('/user/profile/account-tag/setup', verifyUserToken, setupAccountTag);
module.exports = router;
