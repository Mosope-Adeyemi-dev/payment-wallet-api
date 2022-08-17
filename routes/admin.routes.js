const router = require('express').Router();
const {
  // createAdminDemo,
  approvePendingVendor,
  getPendingVendor,
  getAllVendors,
  inviteAdmin,
  signupAdmin,
  login,
} = require('../controllers/admin.controller');
const { verifyAdminToken } = require('../middlewares/auth.middleware');

// router.post('/auth/admin/demo', createAdminDemo);
router.post('/auth/admin/invite', verifyAdminToken, inviteAdmin);
router.put('/auth/admin/signup', signupAdmin);
router.post('/auth/admin/login', login);
router.get('/admin/vendors/pending', verifyAdminToken, getPendingVendor);
router.get('/admin/vendors', verifyAdminToken, getAllVendors);
router.put('/admin/vendor/approve', verifyAdminToken, approvePendingVendor);
module.exports = router;
