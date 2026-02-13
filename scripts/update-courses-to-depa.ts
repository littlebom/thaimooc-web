import { execute, query } from "../lib/mysql-direct";

async function updateCoursesToDepa() {
    try {
        const depaId = '25078';
        const courseIds = [
            'course-1759987609119-107',
            'course-1759987609120-108',
            'course-1759987609122-109',
            'course-1759987609126-110',
            'course-1759987609127-111',
            'course-1759987609129-112',
            'course-1759987609652-396',
            'course-1759987609987-590'
        ];

        console.log(`🔄 กำลังอัปเดต ${courseIds.length} คอร์สให้เป็นของสถาบัน DEPA (${depaId})...\n`);

        for (const courseId of courseIds) {
            // Get course title first
            const courses = await query(
                'SELECT title FROM courses WHERE id = ?',
                [courseId]
            );

            if (courses.length === 0) {
                console.log(`⚠️  ไม่พบคอร์ส ${courseId}`);
                continue;
            }

            const courseTitle = (courses[0] as any).title;

            // Update institutionId
            await execute(
                'UPDATE courses SET institutionId = ?, updatedAt = NOW() WHERE id = ?',
                [depaId, courseId]
            );

            console.log(`✅ อัปเดตแล้ว: [${courseId}] ${courseTitle}`);
        }

        console.log(`\n🎉 อัปเดตเสร็จสมบูรณ์! ทั้งหมด ${courseIds.length} คอร์ส`);

        // Verify
        console.log('\n📊 ตรวจสอบผลลัพธ์:');
        const nullInstitutions = await query(
            "SELECT COUNT(*) as count FROM courses WHERE institutionId IS NULL OR institutionId = ''"
        );
        console.log(`คอร์สที่ยังไม่มี institutionId: ${(nullInstitutions[0] as any).count} คอร์ส`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

updateCoursesToDepa();
