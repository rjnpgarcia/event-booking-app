const express = require("express");
const { Event } = require("../models");
const {
    authenticateUser,
    authorizeRole
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all events
router.get("/", authenticateUser, async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create an event (Admin only)
router.post(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    async (req, res) => {
        try {
            const {
                title,
                description,
                date,
                location,
                available_seats,
                price
            } = req.body;
            const event = await Event.create({
                title,
                description,
                date,
                location,
                available_seats,
                price,
                created_by: req.user.id
            });
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Update event details (Admin only)
router.put(
    "/:id",
    authenticateUser,
    authorizeRole(["admin"]),
    async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event)
                return res.status(404).json({ error: "Event not found" });

            await event.update(req.body);
            res.json(event);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Delete an event (Admin only)
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(["admin"]),
    async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event)
                return res.status(404).json({ error: "Event not found" });

            await event.destroy();
            res.json({ message: "Event deleted" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
