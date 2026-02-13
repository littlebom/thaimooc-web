"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Pencil, Trash2, Shield, ShieldCheck, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  institutionId?: string;
  institutionName?: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UsersListProps {
  initialUsers: AdminUser[];
}

export function UsersList({ initialUsers }: UsersListProps) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getRoleBadge = (role: string, institutionId?: string) => {
    if (role === "super_admin") {
      return <Badge variant="destructive" className="gap-1"><ShieldCheck className="w-3 h-3" />Super Admin</Badge>;
    }
    if (role === "institution_admin") {
      return <Badge variant="outline" className="gap-1 border-blue-500 text-blue-600"><Building2 className="w-3 h-3" />Institution Admin</Badge>;
    }
    return <Badge variant="secondary" className="gap-1"><Shield className="w-3 h-3" />Admin</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default">Active</Badge>;
    }
    return <Badge variant="secondary">Inactive</Badge>;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบผู้ใช้ "${name}" หรือไม่?`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      // Remove from local state
      setUsers(users.filter((user) => user.id !== id));

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(
        error instanceof Error
          ? error.message
          : "ไม่สามารถลบผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>ชื่อ</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead>Login ล่าสุด</TableHead>
          <TableHead className="text-right">การจัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              ไม่พบผู้ใช้ในระบบ
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {getRoleBadge(user.role, user.institutionId)}
                  {user.role === "institution_admin" && user.institutionId && (
                    <span className="text-xs text-muted-foreground">ID: {user.institutionId}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(user.isActive)}</TableCell>
              <TableCell>{formatDate(user.lastLogin)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/admin/users/${user.id}`}>
                      <Pencil className="w-4 h-4 mr-1" />
                      แก้ไข
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id, user.name)}
                    disabled={deletingId === user.id}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {deletingId === user.id ? "กำลังลบ..." : "ลบ"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
