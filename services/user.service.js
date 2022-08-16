const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const { translateError } = require('../utils/mongo_helper');
const jwt = require('jsonwebtoken');

class User {
  constructor(email) {
    this.email = email;
  }

  async createAccount(firstname, lastname, password) {
    try {
      const newCustomer = new UserModel({
        firstname,
        lastname,
        email: this.email,
        password: await this.hashedPassword(password),
        isVendor: false,
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
      const foundUser = await UserModel.findOne({ email: this.email });
      console.log(foundUser);
      if (!foundUser) {
        return [false];
      }
      /* this is to check if the vendor account has been approved by admin,
       * if they haven't been approved they wouldn't be able to login into their accounts.
       */
      if (foundUser.isVendor && !foundUser.isVerifiedVendor) {
        return [false, 'vendor account is pending approval.'];
      }
      if (await this.validatePassword(password, foundUser.password)) {
        return [true, await this.signJwt(foundUser._id)];
      }
      // return [false];
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

  async updateUsername(id, username) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
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

  async findAvailableUsername(username) {
    try {
      const foundUsername = await UserModel.findOne({ username }).select(
        'username'
      );
      if (!foundUsername) {
        return [true];
      }
      return [false];
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async findById(id) {
    try {
      const foundUser = await UserModel.findById(id).select(
        'username firstname lastname photo email isVendor offeredService isVerifiedVendor'
      );
      if (foundUser) {
        return [true, foundUser];
      }
      return [false];
    } catch (error) {
      console.log(error);
      return [false, translateError(error)];
    }
  }

  async findByUsername(username) {
    try {
      const foundUser = await UserModel.findOne({ username }).select(
        'username firstname lastname photo'
      );
      if (foundUser) {
        return [true, foundUser];
      }
      return [false];
    } catch (error) {
      console.log(error);
      return [false, translateError(error)];
    }
  }
}

module.exports = User;
