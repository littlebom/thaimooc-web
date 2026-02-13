
import { query } from '../lib/mysql-direct';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        const banners = await query("SELECT id, title, institutionId, isActive FROM banners WHERE institutionId = '25017'");
        console.log("Local Banners for 25017:", JSON.stringify(banners, null, 2));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

main();
