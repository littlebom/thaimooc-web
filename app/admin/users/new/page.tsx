import { UserForm } from "@/components/admin/user-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession, isSuperAdmin, isInstitutionAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewUserPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Check permissions: Super Admin or Institution Admin
  const canAccess = isSuperAdmin(session) || isInstitutionAdmin(session);

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              คุณไม่มีสิทธิ์เข้าถึงหน้านี้
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For Institution Admin, preset the institutionId
  const presetInstitutionId = isInstitutionAdmin(session) ? session.institutionId : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">เพิ่มผู้ใช้งานใหม่</h1>
          <p className="text-muted-foreground mt-2">
            {isInstitutionAdmin(session)
              ? "สร้างผู้ใช้งานใหม่สำหรับสถาบันของคุณ"
              : "สร้างบัญชีผู้ดูแลระบบใหม่"}
          </p>
        </div>
      </div>

      <UserForm presetInstitutionId={presetInstitutionId} isInstitutionView={!!presetInstitutionId} />
    </div>
  );
}

