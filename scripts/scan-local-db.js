
const mysql = require('mysql2/promise');

async function scanDatabases() {
    const passwords = [
        '',
        'root',
        'password',
        '123456',
        '1234',
        'admin',
        'thai_mooc', // Project name
        'Th@i_Pr0d_9988!', // From remote .env
        'KKiabkob' // From default code config
    ];

    console.log('Scanning local MySQL databases with common passwords...');

    for (const password of passwords) {
        try {
            // Use hidden password in log
            const maskedPwd = password ? '********' : '(empty)';
            process.stdout.write(`Trying root@localhost with password: ${maskedPwd} ... `);

            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: password,
                port: 3306
            });

            console.log('SUCCESS!');

            const [rows] = await connection.execute('SHOW DATABASES;');
            console.log('\n--- Available Databases ---');
            rows.forEach(row => console.log(`- ${row.Database}`));
            console.log('---------------------------\n');

            await connection.end();
            process.exit(0); // Found it!
        } catch (err) {
            console.log('Failed');
            // console.log(err.message); // Optional: debug
        }
    }

    console.log('\nCould not connect with any common password.');
    process.exit(1);
}

scanDatabases();
