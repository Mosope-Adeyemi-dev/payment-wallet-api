const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const adminSchema = Schema(
  {
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    password: { type: String, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    inviteToken: { type: String, required: true },
    initiatorId: { type: ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Admin = new mongoose.model('admin', adminSchema);
module.exports = Admin;
