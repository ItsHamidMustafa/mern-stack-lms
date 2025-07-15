// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method for unified login
userSchema.statics.login = async function (uid, password) {
  if (!uid || !password) {
    throw Error("All fields must be filled!");
  }

  const user = await this.findOne({ uid });

  if (!user) {
    throw Error("We cannot find a user with that registration number!");
  }

  if (!user.isActive) {
    throw Error("Your account has been deactivated. Please contact admin.");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password, please try again!");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  return user;
};

// Static method for creating user (used internally by role-specific signup)
userSchema.statics.createUser = async function (userData) {
  const { uid, email, password, role } = userData;

  if (!email || !password) {
    throw Error("All fields must be filled!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid, please provide a valid email!");
  }

  // Check if user already exists
  const existingUser = await this.findOne({ $or: [{ email }, { uid }] });
  if (existingUser) {
    throw Error("Email or UID already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    uid,
    email,
    password: hash,
    role
  });

  return user;
};

// Method to get role-specific profile
userSchema.methods.getProfile = async function () {
  const roleModels = {
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Admin'
  };

  const Model = mongoose.model(roleModels[this.role]);
  const profile = await Model.findOne({ user: this._id }).populate('user');

  return profile;
};

module.exports = mongoose.model('User', userSchema);