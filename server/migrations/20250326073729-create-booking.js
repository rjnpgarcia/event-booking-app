"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Bookings", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onDelete: "CASCADE"
            },
            event_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "events", key: "id" },
                onDelete: "CASCADE"
            },
            status: {
                type: Sequelize.ENUM("confirmed", "cancelled"),
                defaultValue: "confirmed"
            },
            booked_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        });

        // Prevent double booking for the same event
        await queryInterface.addConstraint("bookings", {
            fields: ["user_id", "event_id"],
            type: "unique",
            name: "unique_user_event_booking"
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Bookings");
    }
};
