const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { User } = require("../models");
const {
    authenticateUser,
    authorizeRole
} = require("../middlewares/authMiddleware");

const router = express.Router();
const secretKey = process.env.JWT_SECRET;

// **Signup Route**
router.post(
    "/signup",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        try {
            // Check if user already exists
            let user = await User.findOne({ where: { email } });
            if (user) {
                return res.status(400).json({ error: "User already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || "user" // Default role is "user"
            });

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }
);

// **Login Route**
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid email"),
        body("password").notEmpty().withMessage("Password is required")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, role: user.role },
                secretKey,
                { expiresIn: "3h" }
            );

            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }
);

// **Get User Profile Route**
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ["password"] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Admin-only route
router.get("/admin", authorizeRole(["admin"]), (req, res) => {
    res.json({ message: "Admin route" });
});

module.exports = router;
