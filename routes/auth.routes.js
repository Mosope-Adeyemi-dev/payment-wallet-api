const router = require('express').Router();
const {
  signup,
  login,
  vendorSignup,
} = require('../controllers/auth.controller');

router.post('/auth/customer/signup', signup);
router.post('/auth/login', login);
router.post('/auth/vendor/signup', vendorSignup);

module.exports = router;
