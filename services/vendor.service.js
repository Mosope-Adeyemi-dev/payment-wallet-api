const VendorModel = require('../models/vendor.model');
const { translateError } = require('../utils/mongo_helper');
const User = require('../services/user.service');

class Vendor extends User {
  constructor(email) {
    super(email);
  }

  async createUserAccount(firstname, lastname, password, offeredService) {
    try {
      const newVendor = new VendorModel({
        firstname,
        lastname,
        email: this.email,
        password: await this.hashedPassword(password),
        offeredService,
      });
      if (await newVendor.save()) {
        return [true, newVendor];
      }
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async authenticateUser(password) {
    try {
      const foundVendor = await VendorModel.findOne({ email: this.email });
      if (!foundVendor) {
        return [false, 'Incorrect email or password'];
      }
      /* this is to check if the vendor account has been approved by admin,
       * if they haven't been approved they wouldn't be able to login into their accounts.
       */
      //   if (!foundVendor.isVerifiedVendor) {
      //     return [false, 'vendor account is pending approval.'];
      //   }
      if (await this.validatePassword(password, foundVendor.password)) {
        return [true, await this.signJwt(foundVendor._id)];
      }
      return [false, 'Incorrect email or password'];
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async updateUsername(id, username) {
    try {
      const updatedUser = await VendorModel.findByIdAndUpdate(
        id,
        { $set: { username } },
        { new: true }
      );
      if (updatedUser) {
        return [true, updatedUser];
      }
      return [false];
    } catch (error) {
      return [false, translateError(error)];
    }
  }
}

module.exports = Vendor;
