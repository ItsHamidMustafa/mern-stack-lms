const bcrypt = require('bcrypt');
const User = require('../models/User');
const { tokenGenerator } = require('../utils/tokenGenerator');


const login = async (req, res) => {
    const { uid, password } = req.body;

    try {
        // Use unified login method
        const user = await User.login(uid, password);

        // Get role-specific profile
        const profile = await user.getProfile();

        // Generate JWT token
        const token = tokenGenerator(user._id);

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                uid: user.uid,
                email: user.email,
                role: user.role,
                firstName: profile.firstName,
                lastName: profile.lastName,
                lastLogin: user.lastLogin
            },
            token
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const fetchCurrentUser = async (req, res) => {
    try {
        // req.user already contains the user data from requireAuth middleware
        // We just need to return it in the expected format

        const userData = {
            _id: req.user._id,
            uid: req.user.uid,
            email: req.user.email,
            role: req.user.role,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            profileId: req.user.profileId
        };

        return res.json({
            success: true,
            user: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to retrieve user!"
        });
    }
};

const updateOwnPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { _id } = req.user;

    try {
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.status(200).json({ msg: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message || 'Something went wrong' });
    }
};

module.exports = {
    login,
    fetchCurrentUser,
    updateOwnPassword
}