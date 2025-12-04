"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUploadAvatar } from "@/lib/hooks/use-profile";
import { EditProfileForm } from "@/components/user/edit-profile-form";
import { ChangePasswordForm } from "@/components/user/change-password-form";
import { AvatarUpload } from "@/components/user/avatar-upload";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function EditProfilePageClient() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    uploadAvatar,
    isLoading: avatarLoading,
    error: avatarError,
  } = useUploadAvatar();

  // Redirect if not authenticated (shouldn't happen on protected route)
  if (!isAuthenticated || !user) {
    router.push("/login");
    return null;
  }

  // Handle profile update success - redirect to profile
  const handleProfileSuccess = () => {
    // Show success toast first
    toast.success(t("editForm.success"));
    // Then redirect
    setTimeout(() => {
      router.push("/profile");
    }, 1000);
  };

  // Handle password change success - show toast and clear form
  const handlePasswordSuccess = () => {
    // Form already cleared in component
    toast.success(t("passwordForm.success"));
  };

  // Handle avatar upload with error handling
  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await uploadAvatar(file);
      if (result.success) {
        toast.success(t("editForm.success"));
      }
    } catch (error) {
      // Error handling is done in the hook, but show additional feedback if needed
      console.error("Avatar upload failed");
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToProfile")}
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{t("editProfile")}</h1>
        <p className="text-muted-foreground">{t("accountSettings")}</p>
      </div>

      <Separator />

      {/* Avatar Upload Section */}
      <AvatarUpload
        currentAvatar={user.avatar_full_url}
        onUpload={handleAvatarUpload}
        isLoading={avatarLoading}
        error={avatarError}
      />

      {/* Profile Edit Form */}
      <EditProfileForm
        user={user}
        onSuccess={handleProfileSuccess}
        onCancel={handleCancel}
      />

      <Separator />

      {/* Password Change Form */}
      <ChangePasswordForm
        onSuccess={handlePasswordSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
