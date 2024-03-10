import { Sequelize,  DataTypes }  from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import db from "../../database/Database.js";


const Queue = db.define('queues',{
    id: {
        type: DataTypes.STRING, 
        primaryKey: true,
        allowNull: false,
        defaultValue: () => uuidv4().replace(/-/g, '').substr(0, 8),
        unique: true 
    },
    hash_admin: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, 
        allowNull: false,
        unique: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    name: DataTypes.STRING
},{
    freezeTableName:true
});

(async () => {
    try {
        // Sincroniza o modelo com o banco de dados
        await db.sync();
        console.log('Client table created successfully.');
    } catch (error) {
        // Se ocorrer um erro, imprime a mensagem de erro
        console.error('Error creating client table:', error);
    }
})();

export default Queue;