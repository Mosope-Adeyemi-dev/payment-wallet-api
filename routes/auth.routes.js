const router = require('express').Router();
const { signup } = require('../controllers/auth.controller');

router.post('/auth/user/signup', signup);

module.exports = router;
