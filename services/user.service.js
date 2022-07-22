const bcrypt = require('bcrypt');
const Customer = require('../models/user.model');
const VendorModel = require('../models/vendor.model');
const { translateError } = require('../utils/mongo_helper');
const jwt = require('jsonwebtoken');
class User {
  constructor(email) {
    this.email = email;
  }

  async createUserAccount(firstname, lastname, password) {
    try {
      const newCustomer = new Customer({
        firstname,
        lastname,
        email: this.email,
        password: await this.hashedPassword(password),
      });
      if (await newCustomer.save()) {
        return [true, await this.signJwt(newCustomer._id), newCustomer];
      }
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async authenticateUser(password) {
    try {
      const foundUser = await Customer.findOne({ email: this.email });
      if (!foundUser) {
        return [false];
      }
      if (await this.validatePassword(password, foundUser.password)) {
        return [true, await this.signJwt(foundUser._id)];
      }
      return [false];
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async hashedPassword(password) {
    const salt = await bcrypt.genSalt(15);
    return await bcrypt.hash(password, salt);
  }

  async signJwt(id) {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    return token;
  }

  async validatePassword(formPassword, dbPassword) {
    return await bcrypt.compare(formPassword, dbPassword);
  }
}

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
      const foundUser = await VendorModel.findOne({ email: this.email });
      if (!foundUser) {
        return [false];
      }
      if (await this.validatePassword(password, foundUser.password)) {
        return [true, await this.signJwt(foundUser._id)];
      }
      return [false];
    } catch (error) {
      return [false, translateError(error)];
    }
  }
}
module.exports = {
  User,
  Vendor,
};
