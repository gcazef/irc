const Sequelize = require("sequelize");
const db = require("../database/db.js");

const Message = db.sequelize.define(
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
        }
        // user: {
        //     type: Sequelize.STRING(21),
        //     references: {
        //         model: User,
        //         key: 'name'
        //     }
        // },
        // channel: {
        //     type: Sequelize.STRING(21),
        //     references: {
        //         model: Channel,
        //         key: 'name'
        //     }
        // }
    },
    {
        timestamps: false,        
        freezeTableName: true
    }
);

module.exports = Message;