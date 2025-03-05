const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const studentSchema = new mongoose.Schema(
  {
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    regno: {
      type: String,
      required: false,
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
    semester: {
      type: Number,
      required: true,
      default: 1,
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
    classId: {
      type: mongoose.Types.ObjectId,
      required: false,
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
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
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
    gradeLevel: {
      type: String,
    },
    major: {
      type: String,
    },
    coursesEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4,
    },
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
    grades: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grade",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },
    accountStatus: {
      type: String,
      enum: ["active", "pending", "deactivated"],
      default: "active",
    },
    emergencyContact: {
      name: {
        type: String,
      },
      relation: {
        type: String,
      },
      contactNumber: {
        type: String,
      },
    },
    photo: {
      type: String,
    },
    notes: {
      type: String,
    },
    scholarshipStatus: {
      type: String,
    },
  },
  { timestamps: true },
);

studentSchema.statics.signup = async function (studentData) {
  const {
    cnic,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    nationality,
    contactNumber,
    email,
    address,
    password,
    currentStatus,
    gradeLevel,
    major,
    coursesEnrolled,
    advisor,
    gpa,
    attendance,
    grades,
    role,
    accountStatus,
    emergencyContact,
    photo,
    notes,
    scholarshipStatus,
  } = studentData;
  const exists = await this.findOne({ email });
  if (!email || !password) {
    throw Error("All fields must be filled!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid, please provide a valid email!");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "This password is not strong enough, please consider using a password that has at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol and a total of 8 characters!",
    );
  }

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const student = await this.create({ ...studentData, password: hash });

  return {
    _id: student._id,
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    nationality: student.nationality,
    contactNumber: student.contactNumber,
    email: student.email,
    currentStatus: student.currentStatus,
    gradeLevel: student.gradeLevel,
    major: student.major,
    coursesEnrolled: student.coursesEnrolled,
    advisor: student.advisor,
  };
};

studentSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled!");
  }

  const student = await this.findOne({ email });

  if (!student) {
    throw Error("We cannot find a student with that email!");
  }

  const match = await bcrypt.compare(password, student.password);

  if (!match) {
    throw Error("Incorrect password, please try again!");
  }

  return student;
};

module.exports = mongoose.model("Student", studentSchema);
