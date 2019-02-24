const Sequelize = require("sequelize");
const db = require("../database/db.js");
const Message = require("./Message");

const Channel = db.sequelize.define(
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
            unique: true
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

Message.belongsTo(Channel, {foreignKey: 'channel', onDelete: 'cascade'});

module.exports = Channel;