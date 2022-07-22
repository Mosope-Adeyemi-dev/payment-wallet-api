const mongoose = require('mongoose');
const { Schema } = mongoose;

const bankAccountSchema = new mongoose.Schema({
  bank: { type: String, required: true },
  accountNumber: { type: Number, required: true },
});

const vendorSchema = new Schema(
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
    photo: String,
    bankAccounts: [bankAccountSchema],
    pin: {
      type: Number,
      trim: true,
      min: [4, 'Pin too short, 4 digits required'],
      max: [4, 'Pin too long'],
    },
    username: { type: String, unique: true },
    offeredService: { type: String, required: true },
    isVerifiedVendor: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const VendorModel = mongoose.model('vendor', vendorSchema);
module.exports = VendorModel;
