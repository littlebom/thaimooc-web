import { notFound } from "next/navigation";
import { CourseTypeForm } from "@/components/admin/course-type-form";
import { query } from "@/lib/mysql-direct";
export const dynamic = "force-dynamic";

async function getCourseType(id: string) {
  if (id === "new") return null;
  try {
    const results = await query("SELECT * FROM course_types WHERE id = ?", [id]);
    return results.length > 0 ? (results[0] as any) : null;
  } catch (error) {
    console.error("Error fetching course type:", error);
    return null;
  }
}

export default async function CourseTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseType = await getCourseType(id);

  if (id !== "new" && !courseType) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {courseType ? "แก้ไขประเภทรายวิชา" : "เพิ่มประเภทรายวิชา"}
        </h1>
        <p className="text-muted-foreground">
          {courseType ? "แก้ไขข้อมูลประเภทรายวิชา" : "สร้างประเภทรายวิชาใหม่"}
        </p>
      </div>

      <CourseTypeForm courseType={courseType} />
    </div>
  );
}
