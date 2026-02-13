import { query } from "../lib/mysql-direct";

async function checkExistingIndexes() {
    try {
        console.log("🔍 ตรวจสอบ Indexes ที่มีอยู่แล้วในตาราง courses...\n");

        const coursesIndexes = await query(
            "SHOW INDEX FROM courses"
        );

        console.log("📊 Indexes ในตาราง courses:");
        const indexMap = new Map<string, string[]>();

        coursesIndexes.forEach((idx: any) => {
            if (!indexMap.has(idx.Key_name)) {
                indexMap.set(idx.Key_name, []);
            }
            indexMap.get(idx.Key_name)!.push(idx.Column_name);
        });

        indexMap.forEach((columns, indexName) => {
            console.log(`  - ${indexName}: ${columns.join(', ')}`);
        });

        console.log("\n🔍 ตรวจสอบ Indexes ในตาราง course_categories...\n");
        const ccIndexes = await query("SHOW INDEX FROM course_categories");

        console.log("📊 Indexes ในตาราง course_categories:");
        const ccIndexMap = new Map<string, string[]>();

        ccIndexes.forEach((idx: any) => {
            if (!ccIndexMap.has(idx.Key_name)) {
                ccIndexMap.set(idx.Key_name, []);
            }
            ccIndexMap.get(idx.Key_name)!.push(idx.Column_name);
        });

        ccIndexMap.forEach((columns, indexName) => {
            console.log(`  - ${indexName}: ${columns.join(', ')}`);
        });

        console.log("\n🔍 ตรวจสอบ Indexes ในตาราง course_course_types...\n");
        const cctIndexes = await query("SHOW INDEX FROM course_course_types");

        console.log("📊 Indexes ในตาราง course_course_types:");
        const cctIndexMap = new Map<string, string[]>();

        cctIndexes.forEach((idx: any) => {
            if (!cctIndexMap.has(idx.Key_name)) {
                cctIndexMap.set(idx.Key_name, []);
            }
            cctIndexMap.get(idx.Key_name)!.push(idx.Column_name);
        });

        cctIndexMap.forEach((columns, indexName) => {
            console.log(`  - ${indexName}: ${columns.join(', ')}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

checkExistingIndexes();
