const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/diif6yk75/image/upload/v1724290405/avatar/etnpigvwswrs8jj8crt0.jpg",
        required: false
    }
});

userSchema.statics.signup = async function (firstName, lastName, email, password) {
    const exists = await this.findOne({ email });

    if( !email || !password ) {
        throw Error('All fields must be filled!');
    }

    if(!validator.isEmail(email)) {
        throw Error('Email is not valid, please provide a valid email!');
    }

    if(!validator.isStrongPassword(password)) {
        throw Error('This password is not strong enough, please consider using a password that has at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol and a total of 8 characters!');
    }

    if(exists) {
        throw Error ('Email already in use');
    };

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ firstName, lastName, email, password: hash });

    return user;
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled!");
    }

    const user = await this.findOne({ email });

    if(!user) {
        throw Error('We cannot find a user with that email!');
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        throw Error('Incorrect password, please try again!');
    }

    return user;
}

module.exports = mongoose.model('users', userSchema);