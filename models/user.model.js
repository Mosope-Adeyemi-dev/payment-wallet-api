const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
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
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
