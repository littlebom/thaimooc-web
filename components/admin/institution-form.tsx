"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeImage } from "@/components/safe-image";
import { ImageUploadWithCrop } from "@/components/admin/image-upload-with-crop";
import { Upload, X, Globe, Phone, Mail, MapPin, Palette, Megaphone } from "lucide-react";
import type { Institution } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InstitutionFormProps {
  institution?: Institution;
}

export function InstitutionForm({ institution }: InstitutionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(
    institution?.logoUrl
      ? (institution.logoUrl.startsWith("http") || institution.logoUrl.startsWith("/")
        ? institution.logoUrl
        : `/uploads/${institution.logoUrl}`)
      : ""
  );

  const [bannerPreview, setBannerPreview] = useState<string>(
    institution?.bannerUrl
      ? (institution.bannerUrl.startsWith("http") || institution.bannerUrl.startsWith("/")
        ? institution.bannerUrl
        : `/uploads/${institution.bannerUrl}`)
      : ""
  );

  const [formData, setFormData] = useState({
    name: institution?.name || "",
    nameEn: institution?.nameEn || "",
    abbreviation: institution?.abbreviation || "",
    description: institution?.description || "",
    logoUrl: institution?.logoUrl || "",
    website: institution?.website || "",
    // CMS Fields
    micrositeEnabled: institution?.micrositeEnabled || false,
    bannerUrl: institution?.bannerUrl || "",
    primaryColor: institution?.primaryColor || "#1e40af", // Default blue
    secondaryColor: institution?.secondaryColor || "#f59e0b", // Default amber
    address: institution?.address || "",
    phoneNumber: institution?.phoneNumber || "",
    email: institution?.email || "",
    socialLinks: institution?.socialLinks || { facebook: "", line: "", twitter: "", youtube: "" },
    metaTitle: institution?.metaTitle || "",
    metaDescription: institution?.metaDescription || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = institution
        ? `/api/institutions/${institution.id}`
        : "/api/institutions";
      const method = institution ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save institution");
      }

      router.push("/admin/institutions");
      router.refresh();
    } catch (error) {
      console.error("Error saving institution:", error);
      alert("Failed to save institution. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  // Load default institution logo for new institutions
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function loadDefaultLogo() {
      if (!institution && !formData.logoUrl) {
        console.log('[Institution Form] Loading default logo...');
        try {
          const response = await fetch('/api/settings');
          if (response.ok) {
            const data = await response.json();
            console.log('[Institution Form] Settings data:', data);
            if (data.defaultInstitutionLogo) {
              console.log('[Institution Form] Setting default logo:', data.defaultInstitutionLogo);
              setFormData(prev => ({
                ...prev,
                logoUrl: data.defaultInstitutionLogo
              }));
              setLogoPreview(data.defaultInstitutionLogo);
            } else {
              console.log('[Institution Form] No default logo found in settings');
            }
          }
        } catch (error) {
          console.error('[Institution Form] Failed to load default institution logo:', error);
        }
      } else {
        console.log('[Institution Form] Skipping default load - institution:', !!institution, 'logoUrl:', formData.logoUrl);
      }
    }

    loadDefaultLogo();
  }, []); // Run only once on mount

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Institution Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload Section - Centered at Top */}
            <div className="flex flex-col items-center justify-center pb-6 border-b">
              <Label className="mb-4">Institution Logo</Label>
              <div className="w-48">
                <ImageUploadWithCrop
                  imageType="institution"
                  currentImageUrl={logoPreview}
                  onImageUploaded={(url) => {
                    handleChange("logoUrl", url);
                    setLogoPreview(url);
                  }}
                  onImageRemoved={() => {
                    handleChange("logoUrl", "");
                    setLogoPreview("");
                  }}
                  label=""
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recommended size: 400x400 pixels</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name (TH) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  placeholder="ชื่อสถาบัน (ภาษาไทย)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn">Name (EN) *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => handleChange("nameEn", e.target.value)}
                  required
                  placeholder="Institution Name (English)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="abbreviation">Abbreviation *</Label>
              <Input
                id="abbreviation"
                value={formData.abbreviation}
                onChange={(e) => handleChange("abbreviation", e.target.value)}
                required
                placeholder="e.g., CU, MIT"
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="logoUrl" className="text-sm text-muted-foreground">Or provide Logo URL</Label>
              <Input
                id="logoUrl"
                type="text"
                value={formData.logoUrl}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
                placeholder="https://... or /uploads/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Thai)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <Separator className="my-6" />

            <div className="flex items-center justify-between space-x-2 bg-slate-50 p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold text-primary">Enable Microsite</Label>
                <div className="text-sm text-muted-foreground">
                  Activate a dedicated website portal for this institution.
                </div>
              </div>
              <Switch
                checked={formData.micrositeEnabled}
                onCheckedChange={(checked) => handleChange("micrositeEnabled", checked)}
              />
            </div>

            {formData.micrositeEnabled && (
              <div className="space-y-6 pt-4 border-t animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Banner Upload */}
                  <div className="space-y-2">
                    <Label>Microsite Banner</Label>
                    <div className="border rounded-md p-4 bg-slate-50">
                      <ImageUploadWithCrop
                        imageType="banner"
                        currentImageUrl={bannerPreview}
                        onImageUploaded={(url) => {
                          handleChange("bannerUrl", url);
                          setBannerPreview(url);
                        }}
                        onImageRemoved={() => {
                          handleChange("bannerUrl", "");
                          setBannerPreview("");
                        }}
                        label=""
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Recommended size: 1940x485 pixels
                      </p>
                    </div>
                  </div>

                  {/* Theme Colors */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={formData.primaryColor || "#1e40af"}
                          onChange={(e) => handleChange("primaryColor", e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.primaryColor || ""}
                          onChange={(e) => handleChange("primaryColor", e.target.value)}
                          placeholder="#1e40af"
                          className="font-mono uppercase"
                          maxLength={7}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Used for buttons, headers, and key accent elements.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={formData.secondaryColor || "#f59e0b"}
                          onChange={(e) => handleChange("secondaryColor", e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.secondaryColor || ""}
                          onChange={(e) => handleChange("secondaryColor", e.target.value)}
                          placeholder="#f59e0b"
                          className="font-mono uppercase"
                          maxLength={7}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Used for emphasis and highlighting.
                      </p>
                    </div>
                  </div>
                </div>

                {institution && (
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      className="border-primary/20 text-primary hover:bg-primary/5 gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`/institutions/${institution.id}`, '_blank');
                      }}
                    >
                      <Globe className="w-4 h-4" />
                      Open Live Microsite
                    </Button>
                  </div>
                )}
              </div>
            )}


          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : institution
                ? "Update Institution"
                : "Create Institution"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/institutions")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
