# Event & Booking System

![Status](https://img.shields.io/badge/status-in%20development-orange)

Welcome to the **Event & Booking System** repository! 🚀 This project is currently **under development** and aims to provide a full-featured event management and booking platform with authentication, role-based access, and payment integration.

## 📌 Project Overview

This system allows users to:

-   🔹 View available events and make bookings.
-   🔹 Manage their bookings (cancel or rebook events).
-   🔹 Receive email confirmations for bookings.

Admins can:

-   ✅ Create, update, and delete events.
-   ✅ Manage event bookings.

## ⚡ Tech Stack

-   **Backend**: Node.js, Express, MySQL, Sequelize ORM
-   **Authentication**: JWT, Bcrypt
-   **Email Service**: Nodemailer (GMAIL integration)
-   **Frontend**: [To be implemented]

## 🏗️ Development Status

-   [x] User Authentication (JWT, Bcrypt, Role-based Access)
-   [x] Event Management System (CRUD operations for admins)
-   [x] Booking System (Prevent overbooking, manage cancellations)
-   [ ] Frontend UI (Work in progress)
-   [ ] Payment Integration (Upcoming)

## 🚀 Installation & Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/event-booking-system.git
    cd event-booking-system
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables (`.env` file):  
   Create a `.env` file in the root directory and add the following:
    ```ini
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_DATABASE=your_db_name
    DB_HOST=your_db_host
    DB_PRODUCTION_DATABASE=your_db_name
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_outlook_email
    EMAIL_PASS=your_outlook_password
    ```
4. Run migrations:
    ```bash
    npx sequelize db:migrate
    ```
5. Start the development server:
    ```bash
    npm start
    ```

---

💡 **Note**: Some features are still in progress. Stay tuned for updates! 🎉
