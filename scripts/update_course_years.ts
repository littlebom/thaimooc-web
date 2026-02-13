
import { query, execute } from '../lib/mysql-direct';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log('Starting course development year update...');

    // 1. Ensure column exists
    try {
        await query('SELECT developmentYear FROM courses LIMIT 1');
        console.log('Column "developmentYear" exists.');
    } catch (e) {
        console.log('Column "developmentYear" does not exist or error checking. Attempting to add it...');
        try {
            await query('ALTER TABLE courses ADD COLUMN developmentYear INT');
            console.log('Column "developmentYear" added successfully.');
        } catch (alterError) {
            console.error('Failed to add column:', alterError);
            // Proceeding hoping it exists or that is not the issue
        }
    }

    // 2. Read and Parse CSV
    const csvPath = path.join(process.cwd(), 'course_data.csv');
    if (!fs.existsSync(csvPath)) {
        console.error('CSV file not found at:', csvPath);
        process.exit(1);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(l => l.trim().length > 0);

    // Simple CSV parser that handles quotes
    const parseLine = (line: string) => {
        const parts: string[] = [];
        let current = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                parts.push(current.trim().replace(/^"|"$/g, '')); // Trim and remove surrounding quotes
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current.trim().replace(/^"|"$/g, ''));
        return parts;
    };

    const dataLines = lines.slice(1); // Skip header
    console.log(`Processing ${dataLines.length} rows...`);

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const line of dataLines) {
        const cols = parseLine(line);
        // CSV Format: Course Code,Title (TH),Title (EN),Created At
        // Index: 0, 1, 2, 3
        const courseCode = cols[0];
        const titleTh = cols[1];
        const yearStr = cols[3];
        const year = parseInt(yearStr);

        if (!courseCode || isNaN(year)) {
            continue;
        }

        try {
            // Try update by courseCode first
            const result = await execute(
                'UPDATE courses SET developmentYear = ? WHERE courseCode = ?',
                [year, courseCode]
            );

            if (result.affectedRows > 0) {
                updatedCount++;
                // console.log(`Updated ${courseCode} -> ${year}`);
            } else {
                // Fallback: try update by Title (TH) if courseCode update didn't affect any rows
                // Note: Title might contain characters that need care, but parameterized query handles it.
                const result2 = await execute(
                    'UPDATE courses SET developmentYear = ? WHERE title = ?',
                    [year, titleTh]
                );

                if (result2.affectedRows > 0) {
                    updatedCount++;
                    console.log(`Updated by Title: "${titleTh}" -> ${year} (CourseCode: ${courseCode} not found)`);
                } else {
                    console.log(`Not Found: ${courseCode} / "${titleTh}"`);
                    notFoundCount++;
                }
            }
        } catch (err) {
            console.error(`Error updating ${courseCode}:`, err);
        }
    }

    console.log('------------------------------------------------');
    console.log(`Update Complete.`);
    console.log(`Total Updated: ${updatedCount}`);
    console.log(`Total Not Found: ${notFoundCount}`);
    console.log('------------------------------------------------');

    process.exit(0);
}

main().catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
});
