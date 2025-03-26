require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, User, Event, Booking, Payment } = require("./models");
const routes = require("./routes/router");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

// Route to test connection
app.get("/", (req, res) => {
    res.send("Event Booking API is running...");
});

// Routes
app.use("/api", routes);

// Sync database
sequelize.sync().then(() => {
    console.log("Database connected");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
