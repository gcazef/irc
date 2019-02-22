const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
    "Channel",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(21),
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);