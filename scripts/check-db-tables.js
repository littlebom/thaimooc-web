
const mysql = require('mysql2/promise');

async function checkTables() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'KKiabkob',
            database: 'thai_mooc',
            port: 3306
        });

        const [rows] = await connection.execute('SHOW TABLES;');
        console.log(`Found ${rows.length} tables in thai_mooc database.`);
        rows.forEach(row => console.log(`- ${Object.values(row)[0]}`));

        await connection.end();
    } catch (err) {
        console.error('Error checking tables:', err.message);
    }
}

checkTables();
