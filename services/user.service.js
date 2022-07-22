const bcrypt = require('bcrypt');
const Customer = require('../models/user.model');
const { translateError } = require('../utils/mongo_helper');
const jwt = require('jsonwebtoken');

// const hashedPassword = async (password) => {
//   const salt = await bcrypt.genSalt(15);
//   return await bcrypt.hash(password, salt);
// };

// const signJwt = (id) => {
//   const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: 60 * 60 * 24 * 30,
//   });
//   return token;
// };

// const validatePassword = async (formPassword, dbPassword) =>
//   await bcrypt.compare(formPassword, dbPassword);

class User {
  constructor(firstname, lastname, email, password) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }

  async createUserAccount() {
    try {
      // const { firstname, lastname, email, password } = newInitializedUser;
      const newCustomer = new Customer({
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: await this.#hashedPassword(this.password),
      });
      if (await newCustomer.save()) {
        return [true, await this.#signJwt(newCustomer._id), newCustomer];
      }
    } catch (error) {
      return [false, translateError(error)];
    }
  }

  async #hashedPassword(password) {
    const salt = await bcrypt.genSalt(15);
    return await bcrypt.hash(password, salt);
  }

  async #signJwt(id) {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    return token;
  }

  async validatePassword(formPassword, dbPassword) {
    await bcrypt.compare(formPassword, dbPassword);
  }
}

module.exports = User;
