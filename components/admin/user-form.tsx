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
  institutionId?: string;
}

interface Institution {
  id: string;
  name: string;
  nameEn: string;
}

interface UserFormProps {
  user?: AdminUser;
  presetInstitutionId?: string | null;  // For Institution Admin mode
  isInstitutionView?: boolean;           // Hide role/institution selection for Institution Admin
}

export function UserForm({ user, presetInstitutionId, isInstitutionView }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    name: user?.name || "",
    email: user?.email || "",
    // For Institution Admin, force role to institution_admin and preset institutionId
    role: isInstitutionView ? "institution_admin" : (user?.role || "admin"),
    isActive: user?.isActive ?? true,
    institutionId: presetInstitutionId || user?.institutionId || "",
  });

  // Fetch institutions list (only if not in institution view mode)
  useEffect(() => {
    if (isInstitutionView) return; // Skip fetching if not needed

    async function fetchInstitutions() {
      try {
        const response = await fetch("/api/institutions");
        const data = await response.json();
        if (data.success) {
          setInstitutions(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      }
    }
    fetchInstitutions();
  }, [isInstitutionView]);

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
              {/* Role selection - hidden for Institution Admin creating users */}
              {!isInstitutionView ? (
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => {
                      handleChange("role", value);
                      // Clear institutionId if not institution_admin
                      if (value !== "institution_admin") {
                        handleChange("institutionId", "");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="institution_admin">Institution Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                    Institution Admin
                  </div>
                </div>
              )}
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

            {/* Institution Dropdown - only show for institution_admin when NOT in institution view */}
            {formData.role === "institution_admin" && !isInstitutionView && (
              <div className="space-y-2">
                <Label htmlFor="institutionId">สถาบัน *</Label>
                <Select
                  value={formData.institutionId}
                  onValueChange={(value) => handleChange("institutionId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถาบัน..." />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name} ({inst.nameEn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  ผู้ใช้จะสามารถจัดการได้เฉพาะ Microsite ของสถาบันที่เลือกเท่านั้น
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
