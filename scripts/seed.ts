
import { execute, queryOne } from '../lib/mysql-direct';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function seed() {
    console.log('🌱 Starting database seeding...');

    const seedDataPath = path.join(process.cwd(), 'scripts', 'seed-data.json');

    if (fs.existsSync(seedDataPath)) {
        console.log('  Found seed-data.json. Importing comprehensive data...');
        try {
            await execute('SET FOREIGN_KEY_CHECKS = 0');

            const rawData = fs.readFileSync(seedDataPath, 'utf8');
            const data = JSON.parse(rawData);
            const tables = Object.keys(data);

            for (const table of tables) {
                const rows = data[table];
                if (rows.length === 0) continue;

                console.log(`  Importing ${rows.length} rows into ${table}...`);

                // Get columns from the first row
                const columns = Object.keys(rows[0]);
                const columnsList = columns.map(col => `\`${col}\``).join(', ');
                const placeholders = columns.map(() => '?').join(', ');

                const sql = `REPLACE INTO \`${table}\` (${columnsList}) VALUES (${placeholders})`;

                for (const row of rows) {
                    const values = columns.map(col => {
                        const val = row[col];

                        // Handle potential ISO date strings
                        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
                            return new Date(val);
                        }

                        // Handle other objects (JSON columns)
                        if (val && typeof val === 'object') {
                            return JSON.stringify(val);
                        }
                        return val;
                    });
                    await execute(sql, values);
                }
            }

            await execute('SET FOREIGN_KEY_CHECKS = 1');
            console.log('✅ Comprehensive seeding completed successfully!');
        } catch (error) {
            await execute('SET FOREIGN_KEY_CHECKS = 1');
            console.error('❌ Comprehensive seeding failed:', error);
            process.exit(1);
        }
    } else {
        console.log('  No seed-data.json found. Running minimal seed...');
        // Fallback to minimal seed (Original logic)
        try {
            // 1. Seed Institution
            const institutionId = 'central-001';
            const existingInst = await queryOne('SELECT id FROM institutions WHERE id = ?', [institutionId]);

            if (!existingInst) {
                console.log('  Adding default institution...');
                await execute(`
                    INSERT INTO institutions (
                        id, name, nameEn, abbreviation, logoUrl, micrositeEnabled, logoVersion, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                `, [
                    institutionId,
                    'Thai MOOC Central',
                    'Thai MOOC Central',
                    'central',
                    '/images/logo.png',
                    0,
                    1
                ]);
            }

            // 2. Seed Admin User
            const adminUsername = 'admin';
            const existingAdmin = await queryOne('SELECT id FROM admin_users WHERE username = ?', [adminUsername]);

            if (!existingAdmin) {
                console.log('  Adding default admin user...');
                const passwordHash = await bcrypt.hash('admin1234', 10);
                await execute(`
                    INSERT INTO admin_users (
                        id, username, password, name, email, role, isActive, institutionId, createdAt, updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                `, [
                    nanoid(),
                    adminUsername,
                    passwordHash,
                    'System Administrator',
                    'admin@thaimooc.local',
                    'super_admin',
                    1,
                    institutionId
                ]);
            }

            // 3. Seed Categories
            const categories = [
                { id: nanoid(), name: 'คอมพิวเตอร์และเทคโนโลยี', nameEn: 'Computer and Technology', icon: 'monitor' },
                { id: nanoid(), name: 'สุขภาพและการแพทย์', nameEn: 'Health and Medicine', icon: 'heart-pulse' },
                { id: nanoid(), name: 'ธุรกิจและการบริหารจัดการ', nameEn: 'Business and Management', icon: 'briefcase' },
                { id: nanoid(), name: 'ภาษาและการสื่อสาร', nameEn: 'Language and Communication', icon: 'languages' },
            ];

            for (const cat of categories) {
                const existingCat = await queryOne('SELECT id FROM categories WHERE name = ?', [cat.name]);
                if (!existingCat) {
                    console.log(`  Adding category: ${cat.name}`);
                    await execute(`
                        INSERT INTO categories (id, name, nameEn, icon, createdAt, updatedAt) 
                        VALUES (?, ?, ?, ?, NOW(), NOW())
                    `, [cat.id, cat.name, cat.nameEn, cat.icon]);
                }
            }

            console.log('✅ Minimal seeding completed successfully!');
        } catch (error) {
            console.error('❌ Minimal seeding failed:', error);
            process.exit(1);
        }
    }
    process.exit(0);
}

seed();
