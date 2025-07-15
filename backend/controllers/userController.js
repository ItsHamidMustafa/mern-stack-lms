const User = require('../models/User');
const { tokenGenerator } = require('../utils/tokenGenerator');

const fetchCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        return res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve user!" });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.login(uid, password);
        const token = tokenGenerator(user._id);

        res.json({
            success: true,
            user: {
                _id: user._id,
                uid: user.uid,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    loginUser,
    fetchCurrentUser
}