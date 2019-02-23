const Sequelize = require("sequelize");
const db = require("../database/db.js");
const Message = require("./Message");

const User = db.sequelize.define(
    "User",
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
        },
        pwdhash: {
            type: Sequelize.STRING(200),
            allowNull: false
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

Message.belongsTo(User, {foreignKey: 'user', onDelete: 'cascade'});
// User.hasMany(Message);

module.exports = User;