"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// **Define Model Relationships**
db.User.hasMany(db.Event, { foreignKey: "created_by" });
db.Event.belongsTo(db.User, { foreignKey: "created_by" });

db.User.hasMany(db.Booking, { foreignKey: "user_id" });
db.Event.hasMany(db.Booking, { foreignKey: "event_id" });
db.Booking.belongsTo(db.User, { foreignKey: "user_id" });
db.Booking.belongsTo(db.Event, { foreignKey: "event_id" });

db.User.hasMany(db.Payment, { foreignKey: "user_id" });
db.Booking.hasOne(db.Payment, { foreignKey: "booking_id" });
db.Payment.belongsTo(db.User, { foreignKey: "user_id" });
db.Payment.belongsTo(db.Booking, { foreignKey: "booking_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
