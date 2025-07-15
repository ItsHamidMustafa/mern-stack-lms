const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const tokenGenerator = (userId) => {
    return jwt.sign({ userId }, process.env.SECRET, { expiresIn: '7d' });
};

module.exports = {
    tokenGenerator
}