const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

// const bankAccountSchema = new mongoose.Schema({
//   bank: { type: String, required: true },
//   accountNumber: { type: Number, required: true },
// });

const WalletSchema = new Schema(
  {
    transactionType: {
      type: String,
      trim: true,
      enum: ['Fund wallet', 'Withdrawal', 'Transfer'],
      required: true,
    },
    accessCode: { type: String },
    operationType: {
      type: String,
      trim: true,
      enum: ['Credit', 'Debit'],
      required: true,
    },
    fundRecipientAccount: { type: String },
    fundOriginatorAccount: { type: ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      trim: true,
      default: 'Pending',
      enum: ['Pending', 'Success', 'Failed'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    referenceId: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model('wallet', WalletSchema);
module.exports = Wallet;
