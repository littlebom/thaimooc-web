
import { query } from "../lib/mysql-direct";

async function run() {
    console.log("Searching menu items...");
    try {
        const items = await query(`
            SELECT * FROM menu_items 
            WHERE label LIKE '%สนับสนุน%' 
            OR label LIKE '%Support%'
            OR labelEn LIKE '%Support%'
        `);
        console.log("Found Items:", items);
        process.exit(0);
    } catch (error) {
        console.error("Error searching menus:", error);
        process.exit(1);
    }
}

run();
