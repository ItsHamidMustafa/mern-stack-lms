const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required!' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        req.student = await Student.findOne({ _id }).select('_id role');

        if (!req.student) {
            return res.status(401).json({ error: 'Student not found!' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized!', token });
    }
}

module.exports = requireAuth;