"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  institutionId?: string | null;
}

interface Institution {
  id: string;
  name: string;
  nameEn: string;
}

interface UserFormProps {
  user?: AdminUser;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "admin",
    isActive: user?.isActive ?? true,
    institutionId: user?.institutionId || "",
  });

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch("/api/institutions");
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns { data: Institution[] } or Institution[]
          // Adjust based on actual API response structure. 
          // Usually list endpoints return an array or { data: array }
          // Let's assume it returns an array for now based on standard practices in this project
          // If it fails we can debug.
          setInstitutions(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      }
    };

    fetchInstitutions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = user
        ? `/api/admin/users/${user.id}`
        : "/api/admin/users";
      const method = user ? "PATCH" : "POST";

      // Prepare data - don't send password if it's empty (for updates)
      const dataToSend: any = { ...formData };
      if (user && !formData.password) {
        delete dataToSend.password;
      }

      // If role is not institution_admin, clear institutionId
      if (dataToSend.role !== 'institution_admin') {
        dataToSend.institutionId = null;
      }

      // Convert empty string to null for institutionId
      if (dataToSend.institutionId === "") {
        dataToSend.institutionId = null;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save user");
      }

      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      console.error("Error saving user:", error);
      alert(
        error instanceof Error
          ? error.message
          : "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลผู้ใช้งาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  required
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password {!user && "*"} {user && "(เว้นว่างไว้หากไม่ต้องการเปลี่ยน)"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required={!user}
                  placeholder={user ? "••••••••" : "password"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="institution_admin">Institution Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">สถานะ</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {formData.isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Institution Selection - Only visible for institution_admin */}
            {formData.role === "institution_admin" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="institution">สังกัดสถาบัน *</Label>
                <Select
                  value={formData.institutionId || ""}
                  onValueChange={(value) => handleChange("institutionId", value)}
                  required={formData.role === "institution_admin"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถาบัน" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name || inst.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  ผู้ดูแลระบบสถาบันจะสามารถจัดการข้อมูลของสถาบันที่เลือกเท่านั้น
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/users")}
            disabled={loading}
          >
            ยกเลิก
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "กำลังบันทึก..." : user ? "อัพเดท" : "สร้างผู้ใช้"}
          </Button>
        </div>
      </div>
    </form>
  );
}
