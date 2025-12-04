# Phase 3 Custom Hooks Implementation - Documentation Update

## Summary

This document summarizes the implementation of Phase 3 custom hooks for user profile management, which bridge the validation schemas from Phase 2 and prepare for the UI components in Phase 4.

## Files Changed

### 1. Created: `lib/hooks/use-profile.ts`

Contains three custom hooks for user profile operations:

- **`useUpdateProfile()`** - Updates user name and email
- **`useUploadAvatar()`** - Handles avatar file uploads
- **`useUpdatePassword()`** - Changes user password

### 2. Updated: `messages/vi.json`

Added error message keys in `user.profile` section:

- `updateFailed` - Profile update error
- `avatarUploadFailed` - Avatar upload error
- `passwordUpdateFailed` - Password change error

## Architecture Overview

### Hook Design Principles

1. **Single Responsibility**: Each hook handles one specific operation
2. **Auth Store Sync**: Profile and avatar hooks sync with Zustand store on success
3. **Error Sanitization**: Returns i18n keys instead of raw API errors
4. **Consistent API**: All hooks return `{ success, data?, error? }` pattern
5. **Loading States**: Built-in loading state management

### Hook Patterns

#### 1. useUpdateProfile Pattern

```typescript
export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateUser = useAuthStore((state) => state.updateUser);

  const updateProfile = useCallback(
    async (data: { name?: string; email?: string }) => {
      // 1. Set loading state
      // 2. Validate with Phase 2 schema
      // 3. Call API
      // 4. Sync auth store on success
      // 5. Return standardized response
    },
    [updateUser]
  );

  return { updateProfile, isLoading, error };
}
```

#### 2. useUploadAvatar Pattern

```typescript
export function useUploadAvatar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateUser = useAuthStore((state) => state.updateUser);

  const uploadAvatar = useCallback(
    async (file: File) => {
      // 1. Validate file with Phase 2 schema
      // 2. Upload via multipart/form-data
      // 3. Update avatar_full_url in auth store
      // 4. Return updated user data
    },
    [updateUser]
  );

  return { uploadAvatar, isLoading, error };
}
```

#### 3. useUpdatePassword Pattern

```typescript
export function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePassword = useCallback(async (data: ChangePasswordData) => {
    // 1. Validate with Phase 2 schema (including current_password)
    // 2. Send only new password fields to API
    // 3. Return success without user data change
  }, []);

  return { updatePassword, isLoading, error };
}
```

## Integration Details

### With Phase 2 Validation Schemas

All hooks use the validation schemas created in Phase 2:

```typescript
// lib/validators/user-schemas.ts
import {
  updateProfileSchema,
  avatarFileSchema,
  changePasswordSchema,
} from "@/lib/validators/user-schemas";

// In hooks:
const validated = updateProfileSchema.parse(data); // useUpdateProfile
avatarFileSchema.parse(file); // useUploadAvatar
changePasswordSchema.parse(data); // useUpdatePassword
```

### With Auth Store

Profile and avatar hooks sync with the Zustand auth store:

```typescript
import { useAuthStore } from "@/lib/store/authStore";

const updateUser = useAuthStore((state) => state.updateUser);

// On successful update:
updateUser(updatedUser);
```

### Error Handling Strategy

Hooks return i18n keys instead of raw errors:

```typescript
// Instead of exposing API errors:
catch (err) {
  setError(err.response?.data?.message); // ❌ Exposes implementation

  // Use sanitized i18n keys:
  setError("user.profile.updateFailed"); // ✅ Consistent, translatable
}
```

## Usage Examples

### Phase 4: React Hook Form Integration

```typescript
// components/user/profile/update-profile-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useUpdateProfile } from "@/lib/hooks/use-profile";
import { updateProfileSchema } from "@/lib/validators/user-schemas";
import { toast } from "sonner";

export function UpdateProfileForm() {
  const t = useTranslations();
  const { updateProfile, isLoading, error } = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data) => {
    const result = await updateProfile(data);

    if (result.success) {
      toast.success(t("notifications.profileUpdated"));
    } else {
      toast.error(t(result.error));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields with shadcn/ui components */}
      {/* Error display with translated messages */}
    </form>
  );
}
```

### Phase 4: Avatar Upload Component

```typescript
// components/user/profile/avatar-upload.tsx
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadAvatar } from "@/lib/hooks/use-profile";
import { toast } from "sonner";

export function AvatarUpload() {
  const { uploadAvatar, isLoading } = useUploadAvatar();

  const onDrop = useCallback(
    async ([file]) => {
      if (!file) return;

      const result = await uploadAvatar(file);

      if (result.success) {
        toast.success("Avatar updated successfully");
      } else {
        toast.error("Failed to update avatar");
      }
    },
    [uploadAvatar]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    maxSize: 5 * 1024 * 1024, // 5MB (client-side validation)
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {/* Dropzone UI */}
    </div>
  );
}
```

### Phase 4: Password Change Form

```typescript
// components/user/profile/change-password-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePassword } from "@/lib/hooks/use-profile";
import { changePasswordSchema } from "@/lib/validators/user-schemas";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const { updatePassword, isLoading } = useUpdatePassword();

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    const result = await updatePassword(data);

    if (result.success) {
      toast.success("Password changed successfully");
      form.reset();
    } else {
      toast.error("Failed to change password");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Current password field */}
      {/* New password field */}
      {/* Password confirmation field */}
      {/* Submit button */}
    </form>
  );
}
```

## Testing Strategy

### Unit Tests for Hooks

```typescript
// __tests__/hooks/use-profile.test.ts
import { renderHook, act } from "@testing-library/react";
import { useUpdateProfile } from "@/lib/hooks/use-profile";

// Mock auth store
jest.mock("@/lib/store/authStore");

describe("useUpdateProfile", () => {
  it("should update profile successfully", async () => {
    const { result } = renderHook(() => useUpdateProfile());

    await act(async () => {
      const response = await result.current.updateProfile({
        name: "New Name",
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    // Assert store was updated
  });
});
```

## Performance Considerations

1. **useCallback**: All async functions are wrapped in useCallback to prevent unnecessary re-renders
2. **Selective Store Updates**: Only update specific user fields in auth store
3. **Optimistic Updates**: Could be added in Phase 4 for better UX
4. **Debouncing**: Consider debouncing rapid profile updates

## Security Notes

1. **Client-Side Validation**: All hooks validate with Zod schemas before API calls
2. **Password Flow**: Current password validated client-side for UX, but not sent to API
3. **File Size Limits**: Client validates 5MB, server enforces 2MB
4. **Error Sanitization**: No raw API errors exposed to UI

## Migration Path

### For Existing Components

```typescript
// Old pattern (direct API call):
const handleSubmit = async () => {
  try {
    await authApi.updateProfile(data);
    toast.success("Updated");
  } catch (err) {
    toast.error(err.message);
  }
};

// New pattern (using hook):
const { updateProfile, isLoading, error } = useUpdateProfile();

const handleSubmit = async () => {
  const result = await updateProfile(data);
  if (result.success) {
    toast.success("Updated");
  } else {
    toast.error(result.error);
  }
};
```

## Next Steps (Phase 4)

1. Create UI components that consume these hooks
2. Implement form layouts with shadcn/ui
3. Add proper loading states and error boundaries
4. Integrate with toast notifications
5. Add file upload progress indicators
6. Implement optimistic updates for better UX

---

**Documentation Updated**: 2025-12-04
**Implementation Complete**: Phase 3
**Next Phase**: Phase 4 - UI Components Implementation

**Related Files**:

- `/lib/hooks/use-profile.ts` - Phase 3 implementation
- `/lib/validators/user-schemas.ts` - Phase 2 validation schemas
- `/lib/store/authStore.ts` - Zustand store
- `/lib/api/endpoints/auth.ts` - API client
- `/messages/vi.json` - Translation keys
