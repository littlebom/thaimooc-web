import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CourseTypesList } from "@/components/admin/course-types-list";
import { query } from "@/lib/mysql-direct";
export const dynamic = "force-dynamic";

async function getCourseTypes() {
  try {
    const courseTypes = await query(
      "SELECT * FROM course_types ORDER BY createdAt DESC",
      []
    );
    return courseTypes as any[];
  } catch (error) {
    console.error("Error fetching course types:", error);
    return [];
  }
}

export default async function CourseTypesPage() {
  const courseTypes = await getCourseTypes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ประเภทรายวิชา (Course Types)</h1>
          <p className="text-muted-foreground">
            จัดการประเภทรายวิชาออนไลน์
          </p>
        </div>
        <Link href="/admin/course-types/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มประเภทรายวิชา
          </Button>
        </Link>
      </div>

      <CourseTypesList initialCourseTypes={courseTypes} />
    </div>
  );
}
