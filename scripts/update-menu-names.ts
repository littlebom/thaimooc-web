
import { execute } from "../lib/mysql-direct";

async function run() {
    console.log("Updating menu items...");
    try {
        // Update Label TH
        const resultTh = await execute(
            `UPDATE menu_items 
             SET label = 'คู่มือและบริการ' 
             WHERE label = 'สนับสนุนการใช้งาน'`
        );
        console.log(`Updated TH labels. Affected rows: ${(resultTh as any).affectedRows}`);

        // Update Label EN (assuming "Support" -> "Manuals & Services")
        const resultEn = await execute(
            `UPDATE menu_items 
             SET labelEn = 'Manuals & Services' 
             WHERE labelEn = 'Support'`
        );
        console.log(`Updated EN labels. Affected rows: ${(resultEn as any).affectedRows}`);

        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating menus:", error);
        process.exit(1);
    }
}

run();
