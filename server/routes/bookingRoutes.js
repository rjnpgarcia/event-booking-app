const express = require("express");
const { Booking, Event, User } = require("../models");
const {
    authenticateUser,
    authorizeRole
} = require("../middlewares/authMiddleware");
const sendEmail = require("../utils/emailService");

const router = express.Router();

// ✅ Book an event (Prevent double booking)
router.post("/", authenticateUser, async (req, res) => {
    const { event_id } = req.body;

    try {
        const event = await Event.findByPk(event_id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.available_seats <= 0) {
            return res.status(400).json({ error: "Event is fully booked" });
        }

        // 🛠️ Only check for 'confirmed' bookings, ignoring 'cancelled'
        const existingBooking = await Booking.findOne({
            where: { user_id: req.user.id, event_id, status: "confirmed" }
        });

        if (existingBooking) {
            return res
                .status(400)
                .json({ error: "You have already booked this event" });
        }

        const booking = await Booking.create({
            user_id: req.user.id,
            event_id,
            status: "confirmed"
        });

        await event.update({ available_seats: event.available_seats - 1 });

        // Fetch user details
        const user = await User.findByPk(req.user.id);

        // ✅ Send email confirmation
        await sendEmail(
            user.email,
            "Booking Confirmation",
            `Hello ${user.name},\n\nYour booking for '${event.title}' is confirmed!\nEvent Date: ${event.date}\n\nThank you!`
        );

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Cancel booking & restore available seats
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        // Find booking
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Check if the logged-in user owns the booking
        if (booking.user_id !== req.user.id) {
            return res
                .status(403)
                .json({ error: "Unauthorized to cancel this booking" });
        }

        // Find the associated event
        const event = await Event.findByPk(booking.event_id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Update booking status to "cancelled"
        await booking.update({ status: "cancelled" });

        // Increase the available seats count
        await event.update({ available_seats: event.available_seats + 1 });

        // Fetch user details
        const user = await User.findByPk(req.user.id);

        // ✅ Send email confirmation
        await sendEmail(
            user.email,
            "Booking Cancellation",
            `Hello ${user.name},\n\nYour booking for '${event.title}' is cancelled!\nEvent Date: ${event.date}\n\nThank you!`
        );

        res.json({ message: "Booking cancelled, seat restored." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
