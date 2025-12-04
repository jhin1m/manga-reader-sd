# Phase 6: Edit Profile Page Documentation

**Implementation details for the user profile editing functionality**

## Overview

Phase 6 implements the user profile editing page at `/profile/edit` route, providing comprehensive functionality for users to update their profile information, change passwords, and upload avatars. This implementation builds upon the foundation established in Phases 2-5.

## Files Created/Modified

### 1. Edit Profile Page (Server Component)

**File**: `/app/(user)/profile/edit/page.tsx`

The server component that:

- Generates proper SEO metadata using `generateMetadata()`
- Sets page title and description via translations
- Configures robots meta to prevent indexing of edit pages
- Delegates to client component for interactivity

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile");

  return {
    title: t("editProfile"),
    description: t("accountSettings"),
    robots: {
      index: false, // Don't index edit pages
      follow: false,
    },
  };
}
```

### 2. Edit Profile Page Client Component

**File**: `/app/(user)/profile/edit/EditProfilePageClient.tsx`

The main client component that:

- Implements authentication checks with redirect logic
- Manages form success callbacks and navigation
- Handles avatar upload with error states
- Integrates all profile editing forms in a unified interface
- Uses the Phase 3 custom hooks for API operations

Key features:

```tsx
// Authentication check
if (!isAuthenticated || !user) {
  router.push("/login");
  return null;
}

// Success handlers
const handleProfileSuccess = () => {
  toast.success(t("editForm.success"));
  setTimeout(() => {
    router.push("/profile");
  }, 1000);
};

// Form sections
- AvatarUpload: Profile picture management
- EditProfileForm: Name and email updates
- ChangePasswordForm: Secure password change
```

### 3. Translation Updates

**File**: `/messages/vi.json`

Added comprehensive Vietnamese translations for edit profile functionality:

```json
"profile": {
  "editProfile": "Chỉnh sửa hồ sơ",
  "accountSettings": "Cài đặt tài khoản",
  "editForm": {
    "title": "Chỉnh sửa thông tin",
    "success": "Cập nhật hồ sơ thành công",
    // ... more form translations
  },
  "passwordForm": {
    "title": "Đổi mật khẩu",
    "success": "Đổi mật khẩu thành công",
    // ... more password translations
  },
  "avatarUpload": {
    "title": "Ảnh đại diện",
    "change": "Thay đổi ảnh",
    // ... more avatar translations
  }
}
```

## Component Architecture

### EditProfilePageClient

- **Main container** for all edit forms
- Manages authentication state
- Handles navigation and success feedback
- Integrates with auth store via hooks

### AvatarUpload Component

- Handles file selection and preview
- Validates image type and size
- Uses `useUploadAvatar` hook for API calls
- Shows loading states during upload
- Displays current avatar from auth store

### EditProfileForm Component

- Implements form using React Hook Form
- Validates with Phase 2 Zod schemas
- Pre-fills with current user data
- Uses `useUpdateProfile` hook for updates
- Shows loading states on submit button

### ChangePasswordForm Component

- Separate form for security
- Requires current password verification
- Password strength validation
- Uses `useUpdatePassword` hook
- Clears form on successful change

## API Integration

The edit page uses a single API endpoint for all profile updates:

**PUT /auth/profile** - Updates profile information

- Accepts partial updates (name, email, password, avatar)
- Validates with Phase 2 schemas
- Returns updated user data
- Supports multipart/form-data for file uploads
- Password change requires current_password for security

## Security Considerations

### Password Change

- Current password is always required
- Password strength validation via Zod
- Password confirmation field
- Secure API communication

### Avatar Upload

- File type validation (images only)
- File size limits (2MB max)
- Sanitization on backend
- URL-based storage (not direct file access)

### CSRF Protection

- All forms include CSRF tokens
- SameSite cookie attributes
- Secure API endpoints

## Form Validation

All forms use the validation schemas defined in Phase 2:

### Profile Update Validation

```typescript
// From lib/validators/user-schemas.ts
updateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});
```

### Password Change Validation

```typescript
// From lib/validators/user-schemas.ts
changePasswordSchema = z.object({
  current_password: z.string().min(8),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  password_confirmation: z.string()
}).refine(...)
```

## User Experience Features

### Loading States

- Submit buttons show loading spinner
- Avatar upload shows progress
- Skeleton states during initial load

### Error Handling

- Field-specific error messages
- Global error notifications via Sonner
- Translated error messages using i18n keys

### Success Feedback

- Toast notifications on success
- Automatic redirect after profile update
- Form clearing after password change

### Responsive Design

- Mobile-first approach
- Adaptive layout for all screen sizes
- Touch-friendly form elements

## Accessibility

- Semantic HTML structure
- Proper form labels and associations
- ARIA attributes where needed
- Keyboard navigation support
- High contrast compatibility
- Screen reader friendly

## Performance Optimizations

- Lazy loading of client component
- Debounced form validation
- Optimized image uploads
- Minimal re-renders through careful state management

## Integration with Auth Store

All profile operations sync with the Zustand auth store:

```typescript
// After successful update
authStore.setUser({
  ...authStore.user,
  ...updatedData,
});
```

This ensures:

- Consistent state across app
- Immediate UI updates
- Auth persistence
- Automatic token refresh

## Testing Considerations

The edit profile page should be tested for:

1. **Authentication Flow**
   - Redirect on unauthenticated access
   - Protected route behavior

2. **Form Submissions**
   - Successful profile updates
   - Password changes with validation
   - Avatar uploads with preview

3. **Error Scenarios**
   - Network failures
   - Validation errors
   - Server errors

4. **User Experience**
   - Loading states display
   - Success notifications
   - Form persistence on errors

5. **Security**
   - CSRF protection
   - Input sanitization
   - Secure password handling

## Phase Completion Summary

Phase 6 successfully implements a complete profile editing solution that:

- ✅ Provides intuitive forms for profile updates
- ✅ Implements secure password change functionality
- ✅ Supports avatar uploads with preview
- ✅ Maintains consistent i18n support
- ✅ Integrates seamlessly with existing architecture
- ✅ Follows established patterns from previous phases

## Next Steps (Phase 8)

Phase 7 (i18n completion) has been completed. Phase 8 will focus on:

1. **Multi-language Support**
   - Adding English translations
   - Language switching functionality
   - RTL language support preparation

2. **Additional Profile Features**
   - Profile privacy settings
   - Notification preferences
   - Account deletion option

3. **UI/UX Improvements**
   - Progressive enhancement patterns
   - Micro-interactions
   - Advanced form validation

## Related Documentation

- [Phase 5 - Profile Display](./phase-5-profile-display-documentation.md) - Display page implementation
- [Phase 3 - Custom Hooks](./phase-3-custom-hooks-documentation.md) - Profile operation hooks
- [Phase 2 - Validation Schemas](./phase-2-validation-schemas-documentation.md) - Form validation
- [Phase 7 - i18n Completion](./phase-7-i18n-completion-documentation.md) - i18n fixes and translations
- [API Documentation](./API_DOCUMENTATION.md) - Backend API reference
- [Forms & Validation Guide](./guides/05-FORMS-VALIDATION.md) - Form patterns
- [i18n Guide](./guides/06-I18N-GUIDE.md) - Translation rules

---

**Phase 6 completed**: 2025-12-04
**Status**: Ready for Phase 8 (Multi-language support)
