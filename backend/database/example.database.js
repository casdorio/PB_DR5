import {Sequelize} from "sequelize";

const name = 'pb_dr5_db';
const user = 'root';
const password = '';
const host = 'localhost';
const dialect = 'mysql';


const db = new Sequelize(name,user,password,{
    host: host,
    dialect: dialect
});

export default db;