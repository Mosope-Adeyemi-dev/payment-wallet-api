const {
  userSignupValidation,
  vendorSignupValidation,
  loginValidation,
} = require('../validations/auth.validations');
const { responseHandler } = require('../utils/responseHandler');
const User = require('../services/user.service');
const Vendor = require('../services/vendor.service');

const signup = async (req, res) => {
  try {
    const { details } = await userSignupValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }
    const { firstname, lastname, password, email } = req.body;

    const user = new User(email);
    const check = await user.createAccount(firstname, lastname, password);
    console.log(check, 'check');

    if (check[0]) {
      res.cookie('token', check[1], { expiresIn: '1d', httpOnly: true });
      return responseHandler(res, 'signup succesful', 201, false, {
        token: check[1],
      });
    }
    return responseHandler(res, check[1], 400, true, '');
  } catch (error) {
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const vendorSignup = async (req, res) => {
  try {
    const { details } = await vendorSignupValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }
    const { firstname, lastname, password, email, offeredService } = req.body;

    const vendor = new Vendor(email);
    const check = await vendor.createAccount(
      firstname,
      lastname,
      password,
      offeredService
    );
    console.log(vendor, 'vendor');

    if (check[0]) {
      return responseHandler(res, 'vendor signup succesful.', 201, false);
    }
    return responseHandler(res, check[1], 400, true, '');
  } catch (error) {
    return responseHandler(res, 'An error occured. Try again.', 500, true, '');
  }
};

const login = async (req, res) => {
  try {
    const { details } = await loginValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }

    const { email, password } = req.body;
    const user = new User(email);
    console.log(user, 'user');
    const check = await user.authenticateUser(password);

    if (check[0]) {
      res.cookie('token', check[1], { expiresIn: '1d', httpOnly: true });
      return responseHandler(res, 'login succesful', 201, false, {
        token: check[1],
      });
    }
    return responseHandler(
      res,
      check[1] || 'Incorrect email or password',
      400,
      true,
      ''
    );
  } catch (error) {
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

module.exports = {
  signup,
  login,
  vendorSignup,
};
