const express = require("express");

const userRoutes = require("./userRoutes");
const eventRoutes = require("./eventRoutes");
const bookingRoutes = require("./bookingRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
