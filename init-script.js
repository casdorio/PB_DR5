const { exec } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const databaseFilePath = 'backend/database/database.js';
const exampleDatabaseFilePath = 'backend/database/example.database.js';

function checkDatabaseFile() {
    return new Promise((resolve, reject) => {
        fs.access(databaseFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true); 
            }
        });
    });
}

function createDatabaseFile(name, host, username, password) {
    const exampleDatabaseContent = fs.readFileSync(exampleDatabaseFilePath, 'utf8');
    const modifiedContent = exampleDatabaseContent
        .replace('varName1', name)
        .replace('varName2', host)
        .replace('varName3', username)
        .replace('varName4', password);

    fs.writeFileSync(databaseFilePath, modifiedContent, 'utf8');
    console.log('Database configuration created successfully.');
}

async function init() {
    try {
        console.log('Starting initialization...');

        console.log('Installing backend and frontend dependencies...');
        await new Promise((resolve, reject) => {
            exec('npm run install-all', (err, stdout, stderr) => {
                if (err) {
                    console.error('Error installing dependencies:', err);
                    reject(err);
                } else {
                    console.log('Dependencies installed successfully.');
                    resolve();
                }
            });
        });

        const databaseExists = await checkDatabaseFile();
        if (!databaseExists) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter database name: ', (name) => {
                rl.question('Enter database host: ', (host) => {
                    rl.question('Enter database username: ', (username) => {
                        rl.question('Enter database password: ', (password) => {
                            createDatabaseFile(name, host, username, password);
                            rl.close();
                            console.log('Database configuration created.');
                            console.log('Starting backend and frontend servers...');
                            startServers();
                        });
                    });
                });
            });
        } else {
            console.log('Database configuration already exists.');
            console.log('Starting backend and frontend servers...');
            startServers();
        }
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

// Função para iniciar os servidores backend e frontend
function startServers() {
    exec('npm run start-all', (err, stdout, stderr) => {
        if (err) {
            console.error('Error starting servers:', err);
        } else {
            console.log('Servers started successfully.');
        }
    });
}

// Iniciar a inicialização
init();
