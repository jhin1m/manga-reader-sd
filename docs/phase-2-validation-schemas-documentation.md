# Phase 2 Validation Schemas Implementation - Documentation Update

## Summary

This document summarizes the documentation updates for Phase 2 validation schemas implementation, focusing on user profile management features.

## Files Changed

### 1. Created: `lib/validators/user-schemas.ts`

- Contains validation schemas for user profile management
- Includes `updateProfileSchema`, `changePasswordSchema`, and `avatarFileSchema`
- All error messages use i18n keys (`user.profile.*`)
- Types are inferred from existing `UpdateProfileData` interface

### 2. Updated: `messages/vi.json`

- Added `user.profile` section with all validation error messages
- Provides Vietnamese translations for form validation
- Structured with hierarchical keys for better organization

## Documentation Updates

### 1. Forms & Validation Guide (`docs/guides/05-FORMS-VALIDATION.md`)

#### Added Sections:

- **User Profile Schemas (Phase 2)**: Complete documentation of the three new schemas
- **Translating Validation Error Messages**: Guide on using i18n keys in Zod schemas
- **Phase 3 & 4 Integration**: Examples of how schemas will be used in hooks and UI components

#### Key Updates:

- Updated file structure to include `user-schemas.ts`
- Added best practice: "Use i18n keys in schemas"
- Added reference to Phase 2 schemas in Reference Files section

#### Code Examples Added:

1. Complete user profile schemas with i18n keys
2. Translation file structure (`messages/vi.json`)
3. Form component with error translation helper
4. Custom hooks for Phase 3 (update profile, change password, avatar upload)
5. UI component example for Phase 4

### 2. Task-to-Documentation Mapping (`docs/TASK-TO-DOCS-MAPPING.md`)

#### Added Sections:

- Updated "Working with Forms" reference examples to include user-schemas.ts
- Enhanced "I need to add a password change form" with Phase 2 schema references
- Added new section: "I need to create a user profile update form"

#### Key Information Added:

- Reference to `lib/validators/user-schemas.ts` for validation schemas
- Phase breakdown explaining how schemas (Phase 2) → hooks (Phase 3) → UI (Phase 4)
- Key requirements for user profile forms
- Translation namespace usage (`user.profile`)

## Architecture Overview

### Phase 2: Validation Schemas (Complete)

```typescript
// lib/validators/user-schemas.ts
export const updateProfileSchema: z.ZodType<Partial<UpdateProfileData>>;
export const changePasswordSchema: z.Schema<ChangePasswordInput>;
export const avatarFileSchema: z.Schema<AvatarFileInput>;
```

### Phase 3: Custom Hooks (Planned)

```typescript
// lib/hooks/use-update-profile.ts
// lib/hooks/use-change-password.ts
// lib/hooks/use-avatar-upload.ts
```

### Phase 4: UI Components (Planned)

```typescript
// components/user/profile/update-profile-form.tsx
// components/user/profile/change-password-form.tsx
// components/user/profile/avatar-upload.tsx
```

## Translation Key Structure

All validation error messages use the `user.profile.*` namespace:

```json
{
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
      "avatarRequired": "Vui lòng chọn avatar"
    }
  }
}
```

## Key Implementation Details

1. **Type Safety**: All schemas infer from existing TypeScript types
2. **Partial Updates**: Profile schema allows optional fields for partial updates
3. **Security**: Password change requires current password confirmation
4. **File Validation**: Separate schema for avatar uploads with size/type checks
5. **Client-Side Validation**: 5MB limit (more lenient)
6. **Server-Side Validation**: 2MB limit (stricter, enforced by API)

## Next Steps (Phase 3)

1. Create custom hooks that consume these validation schemas
2. Implement form submission logic with React Query mutations
3. Add error handling and success feedback
4. Handle file uploads with progress indicators

## Next Steps (Phase 4)

1. Create UI components that consume the custom hooks
2. Implement form layouts with shadcn/ui components
3. Add form validation display with translated error messages
4. Include loading states and user feedback

---

**Documentation Updated**: 2025-12-04
**Related Files**:

- `/lib/validators/user-schemas.ts` - Phase 2 implementation
- `/messages/vi.json` - Translation keys
- `/docs/guides/05-FORMS-VALIDATION.md` - Main documentation
- `/docs/TASK-TO-DOCS-MAPPING.md` - Task reference guide
- `/docs/API_DOCUMENTATION.md` - API endpoint documentation
