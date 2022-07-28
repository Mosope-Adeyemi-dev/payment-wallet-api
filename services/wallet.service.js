const Paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
// const Paystack = require('paystack-api');
const { v4: uuidv4 } = require('uuid');
const WalletModel = require('../models/wallet.model');
const UserModel = require('../models/user.model');

class Wallet {
  constructor(email) {
    this.email = email;
  }

  //Private
  async #storeTransaction(
    referenceId,
    transactionType,
    operationType,
    amount,
    fundRecipientAccount,
    accessCode
  ) {
    const newTransaction = new WalletModel({
      referenceId,
      transactionType,
      operationType,
      amount,
      fundRecipientAccount,
      accessCode,
    });

    if (await newTransaction.save()) {
      return [true, newTransaction];
    }
    return [false];
  }

  async #setPin(pin) {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: this.email },
      { pin },
      { new: true }
    );

    if (updatedUser) {
      return [true, updatedUser];
    }
    return [false, null];
  }

  async #updateTransaction(referenceId, status, processingFees, authorization) {
    const updatedTransaction = await WalletModel.findOneAndUpdate(
      { referenceId },
      { status, processingFees, authorization },
      { new: true }
    );

    if (updatedTransaction) {
      return updatedTransaction;
    }
    return null;
  }

  async initializePaystackCheckout(amount, userId) {
    const helper = new Paystack.FeeHelper();
    const amountPlusPaystackFees = helper.addFeesTo(amount * 100);
    const splitAccountFees = (1 / 100) * amount * 100;

    const result = await Paystack.transaction.initialize({
      email: this.email,
      //If amount is less than NGN2500, waive paystack's NGN100 charge to NGN10
      amount:
        amount >= 2500
          ? Math.ceil(amountPlusPaystackFees + 15000 + splitAccountFees)
          : Math.ceil(amountPlusPaystackFees + 1000 + splitAccountFees),
      reference: uuidv4(),
      currency: 'NGN',
      subaccount: process.env.PAYSTACK_SUB_ACCT,
      // bearer: 'subaccount',
    });

    if (!result) {
      return [false, result];
    }

    const newTransaction = await this.#storeTransaction(
      result.data.reference,
      'Fund',
      'Credit',
      amount,
      userId,
      result.data.access_code
    );
    if (newTransaction) {
      return [true, result.data];
    }
  }

  async verifyTransaction(reference) {
    try {
      const result = await Paystack.transaction.verify({
        reference,
      });

      console.log(result, 'result');
      if (!result) {
        return [false];
      }

      const { paystack, subaccount } = result.data.fees_split;
      const totalProcessingFees = paystack + subaccount;

      const updatedTransaction = await this.#updateTransaction(
        reference,
        result.data.status,
        totalProcessingFees,
        result.data.authorization
      );
      console.log(updatedTransaction);

      if (updatedTransaction) {
        return [true, updatedTransaction];
      }

      return [false];
    } catch (error) {
      return [false];
    }
  }

  async transferFund(
    pin,
    amount,
    fundRecipientAccountTag,
    comment,
    fundOriginatorAccount
  ) {
    const foundRecipient = await UserModel.findById({
      username: fundRecipientAccountTag,
    }).select('username _id');
    if (!foundRecipient) {
      return [false, 'Invalid recipient account'];
    }

    if (await this.#validatePin(pin, fundOriginatorAccount)) {
      const newTransaction = new WalletModel({
        fundRecipientAccount: foundRecipient._id,
        fundOriginatorAccount,
        amount,
        operationType: 'Debit',
        transactionType: 'Transfer',
        status: 'Success',
        referenceId: uuidv4(),
        comment,
      });

      if (await newTransaction.save()) {
        return [true, newTransaction];
      }
      return [false, 'Unable to process transfer'];
    } else {
      return [false, 'Incorrect transaction pin'];
    }
  }

  // async #validateRecepientAccount(username) {

  // }

  async #validatePin(formPin, id) {
    const foundUser = await UserModel.findById(id).select('pin');
    if (foundUser.pin === formPin) {
      return true;
    }
    return false;
  }
}

module.exports = Wallet;
// async intializePaymentChannel(pin, amount) {
//     const params = JSON.stringify({
//       email,
//       amount: amount * 100,
//       reference: uuidv4(),
//       currency: 'NGN',
//       callback_url: `${getUrl}/api/v1/wallet/paystack/verify-transaction/`,
//     });
//     const options = {
//       hostname: 'api.paystack.co',
//       port: 443,
//       path: '/transaction/initialize',
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     };

//     return new Promise(function (resolve, reject) {
//       const req = https
//         .request(options, (res) => {
//           let responseData = '';
//           res.on('data', (chunk) => {
//             responseData += chunk;
//           });
//           res.on('end', () => {
//             /*if request was succesful but paystack service fails i.e status: false*/
//             if (JSON.parse(responseData).status) {
//               resolve([true, JSON.parse(responseData)]);
//             } else {
//               resolve([false, JSON.parse(responseData)]);
//             }
//           });
//         })
//         .on('error', (error) => {
//           console.error(error);
//           resolve([false, JSON.parse(responseData)]);
//         });
//       req.write(params);
//       req.end();
//     });
//   }

//   async verifyTransactionStatus(reference) {
//     const options = {
//       hostname: 'api.paystack.co',
//       port: 443,
//       path: `/transaction/verify/${reference}`,
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     };

//     return new Promise(function (resolve, reject) {
//       const req = https
//         .request(options, (res) => {
//           let responseData = '';
//           res.on('data', (chunk) => {
//             responseData += chunk;
//           });
//           res.on('end', () => {
//             /*if request was succesful but paystack service fails i.e status: false*/
//             if (JSON.parse(responseData).status) {
//               resolve([true, JSON.parse(responseData)]);
//             } else {
//               resolve([false, JSON.parse(responseData)]);
//             }
//           });
//         })
//         .on('error', (error) => {
//           console.error(error);
//           resolve([false, JSON.parse(responseData)]);
//         });
//       req.end();
//     });
//   }

//   async #storeTransaction(email, transactionDetail) {
//     const { status, id, amount, reference } = transactionDetail;
//     await UserModel.findOneAndUpdate(
//       { email },
//       {
//         $push: {
//           transactionHistory: {
//             transactionId: id,
//             status,
//             amount,
//             reference,
//             fullHistory: transactionDetail,
//           },
//         },
//       },
//       { new: true }
//     );
//   }

//   async #checkTransactionExists(reference) {
//     await UserModel.findOne({
//       transactionHistory: { $elemMatch: { reference } },
//     });
//   }

//   async getUserTransactions(userId) {
//     await UserModel.findById(userId).select('transactionHistory');
//   }
