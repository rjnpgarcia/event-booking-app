"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Payment.init(
        {
            user_id: DataTypes.INTEGER,
            booking_id: DataTypes.INTEGER,
            amount: DataTypes.DECIMAL,
            payment_status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "Payment",
            timestamps: false
        }
    );
    return Payment;
};
