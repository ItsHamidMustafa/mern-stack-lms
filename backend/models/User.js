// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

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

// models/Student.js (Updated)
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require('./User');

const studentSchema = new mongoose.Schema({
  // Reference to User schema
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: false,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: false
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: false,
  },
  className: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        const providedDate = new Date(value);
        const age = today.getFullYear() - providedDate.getFullYear();
        const isBirthdayPassedThisYear =
          today.getMonth() > providedDate.getMonth() ||
          (today.getMonth() === providedDate.getMonth() &&
            today.getDate() >= providedDate.getDate());
        const adjustedAge = isBirthdayPassedThisYear ? age : age - 1;
        return adjustedAge >= 15;
      },
      message: "Student must be at least 15 years old",
    },
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  nationality: {
    type: String,
  },
  contactNumber: {
    type: String,
    match: /^[0-9]{10,15}$/,
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  currentStatus: {
    type: String,
    enum: ["Active", "Inactive", "Graduated", "Suspended"],
    default: "Active",
  },
  gradeLevel: { type: String },
  major: { type: String },
  coursesEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
  gpa: {
    type: Number,
    min: 0,
    max: 4,
  },
  attendance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendance",
  }],
  grades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
  }],
  accountStatus: {
    type: String,
    enum: ["active", "pending", "deactivated"],
    default: "pending",
  },
  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    contactNumber: { type: String },
  },
  photo: { type: String },
  notes: { type: String },
  scholarshipStatus: { type: String },
}, { timestamps: true });

// Updated signup method
studentSchema.statics.signup = async function (studentData) {
  const { uid, email, password, ...otherData } = studentData;

  // Create user first
  const user = await User.createUser({
    uid,
    email,
    password,
    role: 'student'
  });

  // Create student profile
  const student = await this.create({
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
    profile: student
  };
};

// Remove the login method as it's now handled by User model

module.exports = mongoose.model("Student", studentSchema);

// models/Teacher.js (Updated)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User');

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

// Updated Authentication Controller Example
const User = require('../models/User');

// Unified login controller
const login = async (req, res) => {
  const { uid, password } = req.body;

  try {
    // Use unified login method
    const user = await User.login(uid, password);

    // Get role-specific profile
    const profile = await user.getProfile();

    // Generate JWT token (assuming you have a token generation function)
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      },
      profile,
      token
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { login };