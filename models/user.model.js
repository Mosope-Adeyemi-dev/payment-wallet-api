const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const bankAccountSchema = new mongoose.Schema({
  bank: { type: String, required: true },
  accountNumber: { type: Number, required: true },
});

const UserSchema = new Schema(
  {
    lastname: { type: String, trim: true },
    firstname: { type: String, trim: true },
    password: {
      type: String,
      trim: true,
      min: [8, 'password characters must be atleast 8'],
      max: [1024, 'password too long'],
    },
    email: {
      type: String,
      unique: [true, 'Email taken, try logging in'],
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/17/17004.png',
    },
    bankAccounts: [bankAccountSchema],
    pin: {
      type: String,
      trim: true,
      min: [4, 'Pin too short, 4 digits required'],
      max: [4, 'Pin too long'],
    },
    username: { type: String },
    isVendor: { type: Boolean, default: false, required: true },
    offeredService: { type: String },
    isVerifiedVendor: { type: Boolean, default: false },
    vendorApproverId: { type: ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('user', UserSchema);
module.exports = User;
