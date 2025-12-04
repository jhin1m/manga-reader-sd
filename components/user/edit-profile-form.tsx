"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateProfile } from "@/lib/hooks/use-profile";
import { updateProfileSchema } from "@/lib/validators/user-schemas";
import type { User } from "@/types/user";
import type { z } from "zod";

type FormData = z.infer<typeof updateProfileSchema>;

interface EditProfileFormProps {
  user: User;
  onSuccess?: (updatedUser: User) => void;
  onCancel?: () => void;
}

export function EditProfileForm({
  user,
  onSuccess,
  onCancel,
}: EditProfileFormProps) {
  const t = useTranslations("profile.editForm");
  const tCommon = useTranslations("common");

  const { updateProfile, isLoading } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = async (data: FormData) => {
    const result = await updateProfile(data);

    if (result.success) {
      toast.success(t("success"));
      onSuccess?.(result.data!);
    } else {
      toast.error(t("error"), {
        description: result.error,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">{t("namePlaceholder")}</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={t("namePlaceholder")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">{t("emailPlaceholder")}</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder={t("emailPlaceholder")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? `${tCommon("loading")}` : t("saveChanges")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
