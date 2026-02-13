
import { query, queryOne } from '../lib/mysql-direct';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        let sql = "";
        const tableName = 'banners';

        // Get Create Table
        const createRow = await queryOne<any>(`SHOW CREATE TABLE ${tableName}`);
        if (createRow && createRow['Create Table']) {
            // We might need to handle IF NOT EXISTS or REPLACE
            // But simpler to just use INSERT IGNORE or REPLACE INTO for data
            // For schema, we already have the table, but maybe we want to be safe?
            // Actually, let's just dump the DATA.
        }

        // Dump Data
        // We use REPLACE INTO to overwrite if exists, or just DELETE FROM banners; INSERT...
        // Let's use INSERT INTO ... ON DUPLICATE KEY UPDATE or just clean table if we assume local is source of truth.
        // Given the user flow, local seems to be the source of truth they want to replicate.
        // But `Thai MOOC` banner exists in prod (and probably local).
        // Let's dump all data.

        const rows = await query<any>(`SELECT * FROM ${tableName}`);
        for (const r of rows) {
            const keys = Object.keys(r).map(k => `\`${k}\``);
            const values = Object.values(r).map(v => {
                if (v === null) return 'NULL';
                if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`;
                if (typeof v === 'boolean') return v ? 1 : 0; // SQL boolean is tinyint
                if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
                return v;
            });
            // Handle boolean isActive specifically if it comes as boolean from driver

            sql += `REPLACE INTO ${tableName} (${keys.join(',')}) VALUES (${values.join(',')});\n`;
        }

        fs.writeFileSync('banners_dump.sql', sql);
        console.log('Dumped banners_dump.sql');
    } catch (e) { console.error(e); }
    process.exit(0);
}
main();
