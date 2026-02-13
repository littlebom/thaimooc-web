
import { query } from "../lib/mysql-direct";

async function run() {
    console.log("Listing menu items...");
    try {
        const items = await query("SELECT * FROM menu_items LIMIT 20");
        console.log("Menu Items:", items);
        process.exit(0);
    } catch (error) {
        console.error("Error listing menus:", error);
        process.exit(1);
    }
}

run();
