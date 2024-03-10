import { Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import db from "../../database/Database.js";
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
    }
}, {
    freezeTableName: true
});

export default Client;

(async () => {
    await db.sync();
})();
