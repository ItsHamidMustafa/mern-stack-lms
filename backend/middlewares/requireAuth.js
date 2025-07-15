const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required!' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if (!decoded) return res.status(401).json({ message: "Invalid token" });

        // Find user by ID from token
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found!' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'User account is deactivated!' });
        }

        // Get role-specific profile
        const profile = await user.getProfile();
        
        if (!profile) {
            return res.status(401).json({ error: 'User profile not found!' });
        }

        // Attach user data to request object
        req.user = {
            _id: user._id,
            uid: user.uid,
            email: user.email,
            role: user.role,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profileId: profile._id
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized!', details: error.message });
    }
}

const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated!' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied! Insufficient permissions.',
                requiredRole: allowedRoles,
                userRole: req.user.role
            });
        }

        next();
    };
};

const getCompleteProfile = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required!' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if (!decoded) return res.status(401).json({ message: "Invalid token" });

        // Find user by ID from token
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found!' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'User account is deactivated!' });
        }

        // Get complete role-specific profile
        const profile = await user.getProfile();
        
        if (!profile) {
            return res.status(401).json({ error: 'User profile not found!' });
        }

        // Attach complete user data to request object
        req.user = {
            // User credentials info
            _id: user._id,
            uid: user.uid,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            
            // Profile info
            profileId: profile._id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            contactNumber: profile.contactNumber,
            fatherName: profile.fatherName,
            cnic: profile.cnic,
            
            // Complete profile object for role-specific data
            profile: profile
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized!', details: error.message });
    }
}

module.exports = {
    requireAuth,
    requireRole,
    getCompleteProfile,
};