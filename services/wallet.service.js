const paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const WalletModel = require('../models/wallet.model');
const { translateError } = require('../utils/mongo_helper');

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
    fundOriginatorAccount,
    accessCode
  ) {
    const newTransaction = new WalletModel({
      referenceId,
      transactionType,
      operationType,
      amount,
      fundOriginatorAccount,
      accessCode,
    });

    if (await newTransaction.save()) {
      return [true, newTransaction];
    }
    return [false];
  }

  async #updateTransaction(referenceId, status, processingFees) {
    try {
      const updatedTransaction = await WalletModel.findOneAndUpdate(
        { referenceId },
        { status, processingFees },
        { new: true }
      );

      if (updatedTransaction) {
        return updatedTransaction;
      }
      return null;
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async initializePaystackCheckout(amount, userId) {
    const helper = new paystack.FeeHelper();
    const amountPlusPaystackFees = helper.addFeesTo(amount * 100);
    const splitAccountFees = (1 / 100) * amount * 100;

    const result = await paystack.transaction.initialize({
      email: this.email,
      //If amount is less than NGN2500, waive paystack's NGN100 charge to NGN10
      amount:
        amount >= 2500
          ? Math.ceil(amountPlusPaystackFees + 15000 + splitAccountFees)
          : Math.ceil(amountPlusPaystackFees + 1000 + splitAccountFees),
      reference: uuidv4(),
      currency: 'NGN',
      subaccount: 'ACCT_u924du62gsd7pho',
      // bearer: 'subaccount',
    });

    if (!result) {
      return [false, result];
    }
    const newTransaction = await this.#storeTransaction(
      result.data.reference,
      'Fund wallet',
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
      const result = await paystack.transaction.verify({
        reference,
      });

      console.log(result);
      if (!result) {
        return [false, result];
      }

      const { paystack, integration, subaccount: }
      totalProcessingFees = result.data.fees_split
      const updatedTransaction = await this.#updateTransaction(
        reference,
        result.data.status,
        result.data.fees_split
      );

      if (updatedTransaction) {
        return [true, updatedTransaction];
      }
      // return [true, result.data];
    } catch (error) {
      return [false, error];
    }

    // .then(async (body) => {
    //   const updatedTransaction = await this.#updateTransaction(
    //     reference,
    //     body.data.status
    //   );
    //   return [true, updatedTransaction];
    // })
    // .catch((error) => {
    //   return [false, error];
    // });

    // if (!result) {
    //   return [false, result];
    // }
    // if (newTransaction) {
    //   return [true, result.data];
    //   const updatedTransaction = await this.#updateTransaction(
    //     reference,
    //     result.data.status
    //   );
    // }
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
