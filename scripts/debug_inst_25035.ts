
import { query } from '../lib/mysql-direct';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        const instId = '25035';
        const inst = await query("SELECT * FROM institutions WHERE id = ?", [instId]);
        const menus = await query("SELECT count(*) as count FROM menus WHERE institutionId = ?", [instId]);

        console.log("Local Institution 25035:", JSON.stringify(inst[0] || {}, null, 2));
        console.log("Local Menu Count:", (menus[0] as any).count);

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

main();
