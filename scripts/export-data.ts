
import { query } from '../lib/mysql-direct';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function exportData() {
    console.log('📡 Fetching data from database...');

    const tables = [
        'webapp_settings',
        'institutions',
        'admin_users',
        'categories',
        'courses',
        'course_categories',
        'course_types',
        'course_course_types',
        'instructors',
        'course_instructors',
        'banners',
        'menus',
        'menu_items',
        'news',
        'guides'
    ];

    const data: Record<string, any[]> = {};

    try {
        for (const table of tables) {
            console.log(`  Exporting table: ${table}...`);
            const rows = await query(`SELECT * FROM ${table}`);
            data[table] = rows;
        }

        const outputPath = path.join(process.cwd(), 'scripts', 'seed-data.json');
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

        console.log(`✅ Data exported successfully to ${outputPath}`);
        console.log(`📊 Summary of exported rows:`);
        for (const table of tables) {
            console.log(`  - ${table}: ${data[table].length} rows`);
        }
    } catch (error) {
        console.error('❌ Export failed:', error);
        process.exit(1);
    }
    process.exit(0);
}

exportData();
