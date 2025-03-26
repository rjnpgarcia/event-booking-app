const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

// Middleware to verify JWT
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res
            .status(401)
            .json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        res.status(400).json({ error: "Unauthorized user" });
    }
};

// Middleware for Role-based Access Control
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ error: "Access denied. Not authorized." });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRole };
