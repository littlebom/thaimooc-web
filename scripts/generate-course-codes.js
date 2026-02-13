const mysql = require('mysql2/promise');

async function generateCourseCodes() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'KKiabkob',
        database: 'thai_mooc'
    });

    try {
        // Get all courses with their institutions
        const [courses] = await connection.execute(`
            SELECT c.id, c.institutionId, i.abbreviation
            FROM courses c
            LEFT JOIN institutions i ON c.institutionId = i.id
            WHERE c.courseCode IS NULL
            ORDER BY c.institutionId, c.createdAt
        `);

        console.log(`Found ${courses.length} courses without course codes`);

        // Group by institution and assign sequential numbers
        const institutionCounters = {};

        for (const course of courses) {
            const abbr = course.abbreviation || 'MOOC';

            // Initialize counter for this institution if not exists
            if (!institutionCounters[abbr]) {
                institutionCounters[abbr] = 1;
            }

            // Generate course code: ABBR + 3-digit number
            const courseCode = `${abbr}${String(institutionCounters[abbr]).padStart(3, '0')}`;

            // Update the course
            await connection.execute(
                'UPDATE courses SET courseCode = ? WHERE id = ?',
                [courseCode, course.id]
            );

            console.log(`✓ ${course.id} -> ${courseCode}`);

            // Increment counter
            institutionCounters[abbr]++;
        }

        console.log('\n✅ Course codes generated successfully!');
        console.log('\nSummary:');
        for (const [abbr, count] of Object.entries(institutionCounters)) {
            console.log(`  ${abbr}: ${count - 1} courses`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

generateCourseCodes();
