const bcrypt = require('bcrypt');
const User = require('../models/User');

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
    updateOwnPassword
}