const mongoose = require('mongoose');
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
    contactNum: {
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
    }
});

teacherSchema.statics.signup = async function (teacherData) {
    const { email, password, firstName, lastName, fatherName, dob, cnic, gender, contactNum } = teacherData;
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

teacherSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled!");
    }

    const teacher = await this.findOne({ email });

    if (!teacher) {
        throw Error("We cannot find a teacher with that email!");
    }

    const match = await bcrypt.compare(password, teacher.password);

    if (!match) {
        throw Error("Incorrect password, please try again!");
    }

    return teacher;
};

module.exports = mongoose.model('teachers', teacherSchema);