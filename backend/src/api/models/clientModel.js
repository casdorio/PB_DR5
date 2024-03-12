import { Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import db from "../../../database/Database.js";
import Queue from "./queueModel.js"; 

const Client = db.define('clients', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => uuidv4().replace(/-/g, '').substr(0, 8),
        unique: true
    },
    queueId: { 
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Queue, 
            key: 'id' 
        }
    },
    session: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('waiting', 'in_service', 'served', 'canceled'), 
        allowNull: false,
        defaultValue: 'waiting'
    },
    serviceNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
    
}, {
    freezeTableName: true
});

(async () => {
    try {
        await db.sync();
        console.log('Client table created successfully.');
    } catch (error) {
        console.error('Error creating client table:', error);
    }
})();

export default Client;
