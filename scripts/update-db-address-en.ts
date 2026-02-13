
import { execute, query } from "../lib/mysql-direct";

async function run() {
    console.log("Checking webapp_settings table for addressEn column...");
    try {
        // Check if column exists
        const columns = await query("SHOW COLUMNS FROM webapp_settings LIKE 'addressEn'");

        if (Array.isArray(columns) && columns.length > 0) {
            console.log("Column 'addressEn' already exists.");
        } else {
            console.log("Adding 'addressEn' column...");
            await execute("ALTER TABLE webapp_settings ADD COLUMN addressEn TEXT");
            console.log("Column 'addressEn' added successfully.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error migrating DB:", error);
        process.exit(1);
    }
}

run();
