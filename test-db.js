const mysql = require('mysql2/promise');

async function testConnection() {
    // Hardcoded from .env.local
    const dbConfig = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'KKiabkob',
        database: 'thai_mooc',
    };

    console.log('Attempting connection with config:', { ...dbConfig, password: '***' });

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Successfully connected to MySQL!');

        const [rows] = await connection.execute('SELECT id, name FROM institutions LIMIT 1');
        console.log('Query result:', rows);

        await connection.end();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
