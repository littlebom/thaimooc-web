
const mysql = require('mysql2/promise');

async function testConnection() {
    const configs = [
        { host: '127.0.0.1', user: 'root', password: '', database: 'test', port: 3306 },
        { host: '127.0.0.1', user: 'root', password: 'password', database: 'test', port: 3306 },
        { host: 'localhost', user: 'root', password: '', database: 'test', port: 3306 },
        { host: '127.0.0.1', user: 'root', password: 'root', database: 'test', port: 3306 },
    ];

    console.log('Checking for local MySQL server...');

    for (const config of configs) {
        try {
            console.log(`Trying ${config.user}@${config.host} with password '${config.password}'...`);
            // Connect without database first to check server existence
            const { database, ...connConfig } = config;
            const connection = await mysql.createConnection(connConfig);
            console.log('SUCCESS: Found local MySQL server!');
            console.log(`Working credentials: user=${config.user}, password=${config.password}`);
            await connection.end();
            process.exit(0);
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                // Continue, maybe another port? but usually 3306
            } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log('Server found but access denied (password incorrect).');
                // This is good news, server exists!
                process.exit(2);
            }
        }
    }

    console.log('FAILURE: Could not connect to any local MySQL server on port 3306.');
    process.exit(1);
}

testConnection();
