const User = require('../models/user.model');

const isVerifiedVendor = async (req, res, next) => {
  const foundVendor = await User.findById(req.id);
  if (!foundVendor.isVerifiedVendor) {
    return res.status(403).json({
      error: true,
      message:
        'Your vendor account is yet to be verified. Contact support for help.',
    });
  }
  return next();
};

module.exports = {
  isVerifiedVendor,
};
