import { analyzeCourseSkills } from "@/lib/gemini";
import { getPendingCourses, saveCourseSkills } from "@/lib/course-skills";

async function run() {
    console.log("Starting Full Analysis worker...");
    console.log("You can close your browser. This process runs on the server.");

    while (true) {
        const batchSize = 10;
        const courses = await getPendingCourses(batchSize);

        if (courses.length === 0) {
            console.log("All courses analyzed! Exiting.");
            break;
        }

        console.log(`\nFound ${courses.length} pending courses. Processing batch...`);

        for (const course of courses) {
            console.log(`[${new Date().toLocaleTimeString()}] Analyzing: ${course.title}...`);

            // Parse tags safely
            let tags: string[] = [];
            try {
                if (course.tags) {
                    if (course.tags.trim().startsWith('[')) {
                        tags = JSON.parse(course.tags);
                    } else {
                        tags = course.tags.split(',').map((t: string) => t.trim());
                    }
                }
            } catch (e) {
                tags = [course.tags || ""];
            }

            try {
                const result = await analyzeCourseSkills({
                    id: course.id,
                    titleTh: course.title,
                    titleEn: course.titleEn,
                    description: course.description,
                    learningOutcomes: course.learningOutcomes,
                    categories: [],
                    tags: tags
                });

                await saveCourseSkills(course.id, result);
                console.log(`✅ Saved: ${course.title} (H1:${result.hardSkills.H1}, S1:${result.softSkills.S1})`);
            } catch (e) {
                console.error(`❌ Error analyzing ${course.title}:`, e);
            }
            // minimal delay
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    process.exit(0);
}

run().catch(console.error);
