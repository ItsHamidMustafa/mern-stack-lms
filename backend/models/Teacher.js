// models/Teacher.js (Updated)
const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
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
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
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
teacherSchema.statics.signup = async function (teacherData) {
  const { uid, email, password, ...otherData } = teacherData;

  // Create user first
  const user = await User.createUser({
    uid,
    email,
    password,
    role: 'teacher'
  });

  // Create teacher profile
  const teacher = await this.create({
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
    profile: teacher
  };
};

// Remove the login method as it's now handled by User model
module.exports = mongoose.model('Teacher', teacherSchema);