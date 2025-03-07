const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
// const Admin = require('../models/Admin');

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required!' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id, role } = jwt.verify(token, process.env.SECRET);
        let user;
        switch (role) {
            case 'student':
                user = await Student.findById(_id).select('_id role');
                break;
            case 'teacher':
                user = await Teacher.findById(_id).select('_id role');
                console.log(user);
                break;
            // case 'admin':
            //     user = await Admin.findById(_id).select('_id role');
            //     break;
            default:
                return res.status(401).json({ error: 'Invalid user role!' });
        }

        if (!user) {
            return res.status(401).json({ error: `${role.charAt(0).toUpperCase() + role.slice(1)} not found!` });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized!', token });
    }
}

module.exports = requireAuth;