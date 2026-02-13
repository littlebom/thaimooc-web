
import { query, execute } from '../lib/mysql-direct';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        const passwordPlain = 'Naresuan@2026';
        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        const userId = nanoid();
        const username = 'admin_nu';
        const name = 'Admin NU';
        const email = 'admin@nu.ac.th';
        const role = 'institution_admin';
        const institutionId = '25035';

        const sql = `INSERT INTO admin_users (id, username, password, name, email, role, isActive, institutionId, createdAt, updatedAt) VALUES ('${userId}', '${username}', '${passwordHash}', '${name}', '${email}', '${role}', 1, '${institutionId}', NOW(), NOW());`;

        fs.writeFileSync('create_admin.sql', sql);
        console.log('Created create_admin.sql');

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

main();
