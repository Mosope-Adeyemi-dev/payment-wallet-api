const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const WalletSchema = new Schema(
  {
    transactionType: {
      type: String,
      trim: true,
      enum: ['Fund', 'Withdrawal', 'Transfer'],
      required: true,
    },
    accessCode: { type: String },
    operationType: {
      type: String,
      trim: true,
      enum: ['Credit', 'Debit'],
      required: true,
    },
    fundRecipientAccount: { type: ObjectId, ref: 'User' },
    fundOriginatorAccount: { type: ObjectId, ref: 'User' },
    status: {
      type: String,
      trim: true,
      default: 'Pending',
      enum: ['Pending', 'Success', 'Failed', 'Abandoned'],
      required: true,
    },
    processingFees: { type: Number, default: 0 },
    amount: {
      type: Number,
      required: true,
    },
    referenceId: { type: String, unique: true, required: true },
    authorization: { type: Object },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model('wallet', WalletSchema);
module.exports = Wallet;
