const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
    "Message",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE
        },
        user: {
            type: Sequelize.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        channel: {
            type: Sequelize.INTEGER,
            references: {
                model: Channel,
                key: 'id'
            }
        }
    },
    {
        freezeTableName: true
    }
);