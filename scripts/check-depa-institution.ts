import { query } from "../lib/mysql-direct";

async function checkDepaInstitution() {
    try {
        const institutions = await query(
            "SELECT id, name, nameEn, abbreviation FROM institutions WHERE LOWER(abbreviation) LIKE '%depa%' OR LOWER(name) LIKE '%depa%' OR LOWER(nameEn) LIKE '%depa%'"
        );

        if (institutions.length === 0) {
            console.log("❌ ไม่พบสถาบันที่มีตัวย่อหรือชื่อที่เกี่ยวข้องกับ 'depa'");
        } else {
            console.log(`✅ พบสถาบันที่เกี่ยวข้องกับ 'depa' จำนวน ${institutions.length} สถาบัน:`);
            institutions.forEach((inst: any) => {
                console.log(`- [${inst.id}] ${inst.name} (${inst.nameEn}) - ตัวย่อ: ${inst.abbreviation}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkDepaInstitution();
