const { userSignupValidation } = require('../validations/auth.validations');
const { responseHandler } = require('../utils/responseHandler');
const User = require('../services/user.service');

const signup = async (req, res) => {
  const { details } = await userSignupValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
    return responseHandler(res, allErrors, 400, true, '');
  }
  const { firstname, lastname, email, password } = req.body;
  const user = new User(firstname, lastname, email, password);

  const check = await user.createUserAccount();
  console.log(check, 'check');

  if (check[0]) {
    return responseHandler(res, 'signup succesful', 201, false, {
      token: check[1],
    });
  }
  return responseHandler(res, check[1], 400, true, '');
};

module.exports = {
  signup,
};
