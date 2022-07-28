const UserModel = require('../models/user.model');
const { translateError } = require('../utils/mongo_helper');
const User = require('../services/user.service');

//Inheritance
class Vendor extends User {
  constructor(email) {
    super(email);
  }

  //Polymorphism
  async createAccount(firstname, lastname, password, offeredService) {
    try {
      const newVendor = new UserModel({
        firstname,
        lastname,
        email: this.email,
        password: await this.hashedPassword(password),
        offeredService,
        isVendor: true,
      });
      if (await newVendor.save()) {
        return [true, newVendor];
      }
    } catch (error) {
      return [false, translateError(error)];
    }
  }
}

module.exports = Vendor;
