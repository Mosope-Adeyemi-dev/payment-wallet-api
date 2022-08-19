const User = require('../services/user.service');
const AdminModel = require('../models/admin.model');
const UserModel = require('../models/user.model');
const { gen } = require('n-digit-token');
const { translateError } = require('../utils/mongo_helper');

class Admin extends User {
  constructor(email) {
    super(email);
  }

  async createAccount(inviteeEmail, initiatorId) {
    try {
      const newAdminAccount = new AdminModel({
        inviteToken: gen(5, { returnType: 'string' }),
        email: inviteeEmail,
        initiatorId,
      });
      if (await newAdminAccount.save()) {
        return [true, newAdminAccount];
      }
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async setupAccount({ firstname, lastname, email, token, password }) {
    try {
      const foundAdmin = await AdminModel.findOne({ email });
      if (foundAdmin && token === foundAdmin.inviteToken) {
        const updateAdmin = await AdminModel.findOneAndUpdate(
          { email },
          {
            firstname,
            lastname,
            password: await this.hashedPassword(password),
            inviteToken: '#',
          },
          { new: true }
        );
        return [true, await this.signJwt(updateAdmin._id)];
      }
      return [false, 'Invalid email or invite token'];
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async authenticateAdmin({ password, email }) {
    try {
      const foundAdmin = await AdminModel.findOne({ email });
      if (!foundAdmin) {
        return [false];
      }
      if (await this.validatePassword(password, foundAdmin.password)) {
        return [true, await this.signJwt(foundAdmin.id)];
      }
      return [false, 'Incorrect username or password'];
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async findPendingVendors() {
    try {
      const foundVendors = await UserModel.find({
        isVendor: true,
        isVerifiedVendor: false,
      }).select(
        'firstname lastname isVendor offeredService isVerifiedVendor createdAt updatedAt email'
      );
      return [true, foundVendors];
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async findAllVendors() {
    try {
      const foundVendors = await UserModel.find({
        isVendor: true,
      }).select(
        'firstname lastname isVendor offeredService isVerifiedVendor createdAt updatedAt email'
      );
      return [true, foundVendors];
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async approveVendor(vendorId, adminId) {
    try {
      const approvedVendor = await UserModel.findOneAndUpdate(
        { id: vendorId },
        {
          isVerifiedVendor: true,
          vendorApproverId: adminId,
        },
        { new: true }
      );
      return [true, approvedVendor];
    } catch (error) {
      return [false, translateError(error)];
    }
  }
}
module.exports = Admin;
