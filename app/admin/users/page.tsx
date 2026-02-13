import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersList } from "@/components/admin/users-list";
import { query } from "@/lib/mysql-direct";
import { getSession, isSuperAdmin, isInstitutionAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getUsers(institutionId?: string | null) {
  if (institutionId) {
    // Institution Admin sees only users from their institution
    const users = await query<any>(
      'SELECT id, username, name, email, role, isActive, institutionId, lastLogin, createdAt, updatedAt FROM admin_users WHERE institutionId = ? ORDER BY createdAt DESC',
      [institutionId]
    );
    return users;
  }

  // Super Admin sees all users
  const users = await query<any>(
    'SELECT id, username, name, email, role, isActive, institutionId, lastLogin, createdAt, updatedAt FROM admin_users ORDER BY createdAt DESC'
  );
  return users;
}

export default async function UsersPage() {
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

  // Determine which users to show
  const institutionId = isInstitutionAdmin(session) ? session.institutionId : null;
  const users = await getUsers(institutionId);
  const isInstitutionView = !!institutionId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการผู้ใช้งาน</h1>
          <p className="text-muted-foreground mt-2">
            {isInstitutionView
              ? "จัดการผู้ใช้งานในสถาบันของคุณ"
              : "จัดการบัญชีผู้ดูแลระบบ (Admin Users)"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มผู้ใช้งาน
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <UsersList initialUsers={users} />
      </Suspense>
    </div>
  );
}

