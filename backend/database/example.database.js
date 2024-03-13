import {Sequelize} from "sequelize";

const name = 'pb_dr5_db';
const user = 'root';
const password = '';
const host = 'localhost';
const dialect = 'mysql';


const db = new Sequelize(name, user, password, {
    host: host,
    dialect: dialect
});

// Testar a conexão com o banco de dados
db.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

export default db;