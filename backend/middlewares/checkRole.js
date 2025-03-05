const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'You must be logged in to access this resource!' });
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ error: 'Access denied, insufficient permissions!' });
        }
    };
};

module.exports = checkRole;