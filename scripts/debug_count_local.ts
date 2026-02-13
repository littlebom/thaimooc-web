
import { query } from '../lib/mysql-direct';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        const instId = '25017';
        const courses = await query("SELECT count(*) as count FROM courses WHERE institutionId = ?", [instId]);
        const menus = await query("SELECT count(*) as count FROM menus WHERE institutionId = ?", [instId]);
        const menuItems = await query("SELECT count(*) as count FROM menu_items WHERE menuId IN (SELECT id FROM menus WHERE institutionId = ?)", [instId]);

        console.log("Local Data Counts for 25017:");
        console.log("Courses:", (courses[0] as any).count);
        console.log("Menus:", (menus[0] as any).count);
        console.log("Menu Items:", (menuItems[0] as any).count);

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

main();
