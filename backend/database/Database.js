import {Sequelize} from "sequelize";

const db = new Sequelize('pb_dr5_db','root','',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;