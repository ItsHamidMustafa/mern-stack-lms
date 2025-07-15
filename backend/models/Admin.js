const User = require('../models/User');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  // Reference to User schema
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  leftAt: {
    type: Date,
    default: null
  },
  cnic: {
    type: String,
    unique: true
  },
  isWorking: {
    type: Boolean,
    default: true
  },
  contactNumber: {
    type: Number,
    default: null
  }
});

// Updated signup method
adminSchema.statics.signup = async function (adminData) {
  const { uid, email, password, ...otherData } = adminData;

  // Create user first
  const user = await User.createUser({
    uid,
    email,
    password,
    role: 'admin'
  });

  // Create admin profile
  const admin = await this.create({
    user: user._id,
    ...otherData
  });

  return {
    user: {
      _id: user._id,
      uid: user.uid,
      email: user.email,
      role: user.role
    },
    profile: admin
  };
};

// Remove the login method as it's now handled by User model

module.exports = mongoose.model('Admin', adminSchema);
