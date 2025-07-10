const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true
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
        default: "teacher",
        required: true,
    }
});

teacherSchema.statics.signup = async function (teacherData) {
    const { email, password, firstName, lastName, fatherName, dob, cnic, gender, contactNumber, department } = teacherData;
    const exists = await this.findOne({ email });
    
    if (!email || !password) {
        throw Error("All fields must be filled!");
    }

    if (exists) {
        throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const teacher = await this.create({ ...teacherData, password: hash });
    return teacher;
};

teacherSchema.statics.login = async function (uid, password) {
    if (!uid || !password) {
        throw Error("All fields must be filled!");
    }

    const teacher = await this.findOne({ uid });

    if (!teacher) {
        throw Error("We cannot find a teacher with that registration number!");
    }

    const match = await bcrypt.compare(password, teacher.password);

    if (!match) {
        throw Error("Incorrect password, please try again!");
    }

    return teacher;
};

module.exports = mongoose.model('Teacher', teacherSchema);