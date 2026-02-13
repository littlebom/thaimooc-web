
import { query } from '../lib/mysql-direct';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        const rows = await query("SELECT * FROM institutions WHERE id = '25017'");
        console.log("Local Data for 25017:", JSON.stringify(rows[0], null, 2));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

main();
