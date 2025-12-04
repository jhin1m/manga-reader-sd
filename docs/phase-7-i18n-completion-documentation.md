# Phase 7: i18n Translations Completion Documentation

**Implementation details for completing internationalization support and fixing translation issues**

## Overview

Phase 7 completes the internationalization (i18n) implementation by fixing translation path issues, adding missing translation keys, and resolving SSR (Server-Side Rendering) compatibility problems. This phase ensures that all user-facing text properly uses the `useTranslations()` hook with correct namespace paths.

## Key Changes Made

### 1. Translation Path Fixes

**Issue**: Components were using incorrect translation paths

- Fixed: Changed from `"profile"` to `"user.profile"` namespace
- Affected components: Profile display and edit components

**Before**:

```tsx
const t = useTranslations("profile");
```

**After**:

```tsx
const t = useTranslations("user.profile");
```

### 2. Added Missing Translation Keys

**File**: `/messages/vi.json`

Added comprehensive translations for:

#### Avatar Upload Functionality

```json
"user": {
  "profile": {
    "editForm": {
      "avatarLabel": "Ảnh đại diện",
      "avatarDescription": "Tải lên ảnh đại diện mới. Kích thước tối đa 5MB. Định dạng: JPG, PNG, GIF, WebP.",
      "avatarUploading": "Đang tải lên ảnh...",
      "avatarUploadSuccess": "Ảnh đại diện đã được cập nhật!",
      "avatarUploadError": "Không thể tải lên ảnh. Vui lòng thử lại.",
      "avatarSelectFile": "Chọn ảnh",
      "avatarFileSelected": "Đã chọn file: {filename}",
      "avatarPreview": "Xem trước",
      // ... more keys
    }
  }
}
```

#### Form Placeholders and Validation

```json
"user": {
  "profile": {
    "editForm": {
      "namePlaceholder": "Nhập tên của bạn",
      "emailPlaceholder": "Nhập email của bạn",
    },
    "passwordForm": {
      "currentPasswordPlaceholder": "Nhập mật khẩu hiện tại",
      "newPasswordPlaceholder": "Nhập mật khẩu mới",
      "confirmPasswordPlaceholder": "Nhập lại mật khẩu mới",
    }
  }
}
```

#### Error Messages

```json
"user": {
  "profile": {
    "nameMinChars": "Tên tối thiểu 2 ký tự",
    "nameMaxChars": "Tên tối đa 50 ký tự",
    "emailInvalid": "Email không hợp lệ",
    "passwordMinLength": "Mật khẩu mới tối thiểu 6 ký tự",
    "passwordMaxLength": "Mật khẩu quá dài",
    "currentPasswordRequired": "Vui lòng nhập mật khẩu hiện tại",
    "passwordConfirmationRequired": "Vui lòng xác nhận mật khẩu",
    "passwordMismatch": "Mật khẩu xác nhận không khớp",
    "fileRequired": "Vui lòng chọn một file",
    "fileSizeExceeded": "Kích thước file tối đa 5MB",
    "fileTypeInvalid": "Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)",
    // ... more validation messages
  }
}
```

### 3. SSR Compatibility Fixes

**Issue**: Components using browser-only APIs (`localStorage`, `window`) causing SSR errors

**Solution**: Implemented proper SSR-safe patterns

#### Location Hook Fix

```typescript
// lib/hooks/use-location.ts
import { useRouter, usePathname } from "next/navigation";

export function useLocation() {
  const router = useRouter();
  const pathname = usePathname();

  return {
    pathname,
    push: router.push,
    replace: router.replace,
    back: router.back,
    // ... other navigation methods
  };
}
```

#### localStorage SSR Wrapper

```typescript
// lib/utils/ssr-safe.ts
export function getSSRSafeItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function setSSRSafeItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}
```

### 4. Component Import Cleanup

**Fixed**: Removed unused imports from profile components

**Files affected**:

- `/components/user/EditProfileForm.tsx`
- `/components/user/ChangePasswordForm.tsx`
- `/components/user/AvatarUpload.tsx`

**Example cleanup**:

```tsx
// Removed unused imports
// import { useState } from 'react';  // Not used
// import { useRouter } from 'next/navigation';  // Replaced with useLocation

// Kept only necessary imports
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
```

## Updated Translation Structure

### New Namespace Organization

The `user` namespace now contains all user profile related translations:

```json
{
  "user": {
    "profilePage": "Trang cá nhân",
    "editProfile": "Chỉnh sửa hồ sơ",
    "changePassword": "Đổi mật khẩu",
    "changeAvatar": "Đổi avatar",
    "profile": {
      "title": "Hồ sơ cá nhân",
      "subtitle": "Quản lý thông tin cá nhân và theo dõi thành tựu của bạn",
      "editForm": {
        // All edit form translations
      },
      "passwordForm": {
        // All password form translations
      },
      "sections": {
        // Section titles
      },
      "fields": {
        // Field labels and values
      },
      "emptyStates": {
        // Empty state messages
      }
    }
  }
}
```

### Translation Key Naming Conventions

1. **Form Fields**: Use `placeholder` suffix for input placeholders
   - `"namePlaceholder"`
   - `"emailPlaceholder"`

2. **Validation Messages**: Use descriptive validation keys
   - `"nameMinChars"` for minimum length
   - `"emailInvalid"` for invalid email format

3. **Status Messages**: Use success/error suffixes
   - `"avatarUploadSuccess"`
   - `"avatarUploadError"`

4. **Actions**: Use verb-based keys
   - `"saveChanges"`
   - `"upload"`
   - `"cancel"`

## SSR Implementation Details

### Server-Side Rendering Best Practices

1. **No Browser APIs in Server Components**
   - Avoid `window`, `document`, `localStorage`
   - Use Next.js navigation primitives

2. **Dynamic Imports for Client-Side Only Code**

   ```tsx
   "use client";

   import dynamic from "next/dynamic";

   const ClientOnlyComponent = dynamic(
     () => import("./ComponentThatUsesBrowserAPIs"),
     { ssr: false }
   );
   ```

3. **Conditional Rendering for SSR**

   ```tsx
   const isClient = typeof window !== "undefined";

   if (isClient) {
     // Browser-only code
   }
   ```

### Authentication SSR Compatibility

The auth store now properly handles SSR:

```typescript
// lib/store/auth.ts
export const useAuth = () => {
  const store = useAuthStore();

  // SSR-safe initial state
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  return store;
};
```

## Performance Optimizations

### Translation Loading Optimizations

1. **Lazy Loading Translations**
   - Translations loaded only when needed
   - Proper caching strategies

2. **Minimal Bundle Impact**
   - Tree-shaking unused translations
   - Compression of translation files

3. **Caching Strategy**
   ```typescript
   // next.config.ts
   module.exports = {
     experimental: {
       optimizePackageImports: ["next-intl"],
     },
   };
   ```

### Component Rendering Optimizations

1. **Memoization of Translation Calls**

   ```tsx
   const t = useMemo(() => useTranslations("user.profile"), []);
   ```

2. **Selective Re-renders**
   - Only re-render components when relevant translations change

## Testing i18n Implementation

### Unit Testing

Test components with different translation contexts:

```tsx
// Example test for profile form
import { renderWithTranslations } from "@/test/utils";

test("renders form with correct translations", async () => {
  const { getByText } = await renderWithTranslations(
    <EditProfileForm />,
    "vi",
    {
      "user.profile.editForm.title": "Chỉnh sửa thông tin",
      "user.profile.editForm.namePlaceholder": "Nhập tên của bạn",
    }
  );

  expect(getByText("Chỉnh sửa thông tin")).toBeInTheDocument();
  expect(getByPlaceholderText("Nhập tên của bạn")).toBeInTheDocument();
});
```

### Integration Testing

Test full translation flow:

1. **Namespace Resolution**
   - Verify correct namespace resolution
   - Test fallback behavior

2. **Language Switching** (Future)
   - Test language switching functionality
   - Verify persistent language preference

3. **SSR Hydration**
   - Test server-side rendering with translations
   - Verify hydration matches server output

## Migration Guide

### For Existing Components

To update components with correct i18n implementation:

1. **Update Translation Paths**

   ```tsx
   // Old
   const t = useTranslations("profile");

   // New
   const t = useTranslations("user.profile");
   ```

2. **Add Missing Translations**
   - Check for hardcoded strings
   - Add corresponding keys to `messages/vi.json`

3. **Fix SSR Issues**
   - Replace browser APIs with Next.js equivalents
   - Use SSR-safe patterns for localStorage

4. **Clean Up Imports**
   - Remove unused imports
   - Consolidate related imports

### Validation Checklist

Before committing changes:

- [ ] All user-facing text uses `useTranslations()`
- [ ] Correct namespace paths (`user.profile` not `profile`)
- [ ] No hardcoded strings in JSX
- [ ] SSR-safe implementation (no browser APIs)
- [ ] Proper error message translations
- [ ] Form placeholders translated
- [ ] Loading states translated
- [ ] Success/error notifications translated

## Phase Completion Summary

Phase 7 successfully:

- ✅ Fixed all translation path issues
- ✅ Added missing translation keys for avatar upload
- ✅ Added form placeholders and validation messages
- ✅ Resolved SSR compatibility issues
- ✅ Cleaned up unused imports
- ✅ Established proper i18n patterns for future development

## Future Enhancements (Phase 8)

Phase 8 will focus on:

1. **Multi-language Support**
   - Adding English translations
   - Language switcher component
   - Persistent language preferences

2. **Advanced i18n Features**
   - Pluralization rules
   - Date/time formatting
   - Number formatting per locale

3. **RTL Language Support**
   - Layout direction switching
   - RTL-specific styles
   - Testing with Arabic/Hebrew

## Related Documentation

- [Phase 6 - Edit Profile](./phase-6-profile-edit-documentation.md) - Previous phase implementation
- [i18n Guide](./guides/06-I18N-GUIDE.md) - Complete i18n rules and patterns
- [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Component i18n integration
- [SSR Guide](./guides/09-NEXTJS-BEST-PRACTICES.md) - Server-side rendering best practices

---

**Phase 7 completed**: 2025-12-04
**Status**: Ready for Phase 8 (Multi-language support)
