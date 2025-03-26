const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send an email confirmation
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text message
 * @param {string} html - HTML content (optional)
 */
async function sendEmail(to, subject, text, html = null) {
    try {
        await transporter.sendMail({
            from: `"Event Booking" <${process.env.OUTLOOK_USER}>`,
            // to,
            to: "ralph.jnpgarcia@gmail.com",
            subject,
            text,
            html: html || text // If HTML is not provided, use text
        });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error(`❌ Email failed: ${error.message}`);
    }
}

module.exports = sendEmail;
