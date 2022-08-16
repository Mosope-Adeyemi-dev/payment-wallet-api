const router = require('express').Router();
const {
  inviteAdmin,
  signupAdmin,
  login,
} = require('../controllers/admin.controller');
const { verifyAdminToken } = require('../middlewares/auth.middleware');

router.post('/auth/admin/invite', verifyAdminToken, inviteAdmin);
router.put('/auth/admin/signup', signupAdmin);
router.post('/auth/admin/login', login);
module.exports = router;
