const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

const fetchCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user!' });
    }
}

const signupUser = async (req, res) => {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await User.signup(firstName, lastName, email, password);

        const token = createToken(user._id);

        res.status(200).json({ ...user._doc, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ id: user._id, avatar: user.avatar, firstName: user.firstName, lastName: user.lastName, role: user.role, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such user is valid' });
    }

    const user = await User.findByIdAndUpdate(id, { firstName, lastName }, { new: true });

    if (!user) {
        res.status(400).json({ error: 'No such user!' });
    }

    res.status(200).json({ _id: user.id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role });
}

module.exports = {
    signupUser,
    loginUser,
    updateUser,
    fetchCurrentUser
}