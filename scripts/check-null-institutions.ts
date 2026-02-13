
import { query } from "../lib/mysql-direct";

async function checkNullInstitutions() {
    try {
        const courses = await query(
            "SELECT id, title, institutionId FROM courses WHERE institutionId IS NULL OR institutionId = ''"
        );

        console.log(`Found ${courses.length} courses with missing institutionId:`);
        courses.forEach((c: any) => {
            console.log(`- [${c.id}] ${c.title}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkNullInstitutions();
