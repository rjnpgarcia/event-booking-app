"use strict";
const { Sequelize, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Booking.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" }
            },
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "events", key: "id" }
            },
            status: {
                type: DataTypes.ENUM("confirmed", "cancelled"),
                defaultValue: "confirmed"
            },
            booked_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        },
        {
            sequelize,
            modelName: "Booking",
            timestamps: false
        }
    );
    return Booking;
};
