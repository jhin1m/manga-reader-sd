# Task-to-Documentation Mapping

**Quick reference for finding relevant documentation based on your current task**

**💡 Tip**: Bookmark this page! Use Cmd+F / Ctrl+F to search for your task.

---

## 🎯 By Task Type

### Creating a New Component

**Read (in order):**

1. [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Structure, imports, Server/Client split
2. [i18n Guide](./guides/06-I18N-GUIDE.md) - Translation usage (MANDATORY)
3. [UI Components](./guides/08-UI-COMPONENTS.md) - shadcn/ui components
4. [Checklist](./references/CHECKLIST.md) - Verify before commit

**Reference examples:**

- `app/home-content.tsx` - Client component with i18n
- See [Examples](./references/EXAMPLES.md#components)

**Common mistakes to avoid:**

- ❌ Hardcoded text (use `useTranslations()`)
- ❌ Using `<img>` instead of Next.js `<Image>`
- ❌ Using `<a>` instead of Next.js `<Link>`

---

### Creating a New Page

**Read (in order):**

1. [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Server/Client split pattern
2. [SEO & Metadata](./guides/07-SEO-METADATA.md) - Metadata setup (MANDATORY)
3. [i18n Guide](./guides/06-I18N-GUIDE.md) - Translations
4. [Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md) - Routing structure

**Reference examples:**

- `app/page.tsx` - Server component with metadata and JSON-LD
- `app/home-content.tsx` - Client component content
- See [Examples](./references/EXAMPLES.md#components)

**Common mistakes to avoid:**

- ❌ Hardcoded metadata (use centralized config)
- ❌ Missing JSON-LD schemas
- ❌ Hardcoded text instead of translations

---

### Working with Forms

**Read (in order):**

1. [Forms & Validation](./guides/05-FORMS-VALIDATION.md) - Complete pattern
2. [UI Components](./guides/08-UI-COMPONENTS.md) - Form UI components
3. [i18n Guide](./guides/06-I18N-GUIDE.md) - Translating labels & errors
4. [API Integration](./guides/04-API-INTEGRATION.md) - Using mutations

**Reference examples:**

- `lib/validators/auth.ts` - Zod schemas
- `lib/validators/user-schemas.ts` - User profile & password schemas (Phase 2)
- See [Examples](./references/EXAMPLES.md#validation)

**Common mistakes to avoid:**

- ❌ No Zod schema validation
- ❌ Hardcoded labels/placeholders
- ❌ Missing error handling
- ❌ No loading state on submit button

---

### API Integration

**Read (in order):**

1. [API Integration](./guides/04-API-INTEGRATION.md) - Complete workflow
2. [State Management](./guides/03-STATE-MANAGEMENT.md) - React Query usage
3. [API Documentation](./API_DOCUMENTATION.md) - Backend endpoint specs

**Reference examples:**

- `lib/api/client.ts` - API client setup
- `lib/api/endpoints/auth.ts` - Auth endpoints
- `lib/api/endpoints/manga.ts` - Endpoints with query params
- See [Examples](./references/EXAMPLES.md#api-integration)

**Common mistakes to avoid:**

- ❌ Not using type-only imports (`import type`)
- ❌ Missing error handling
- ❌ No loading states
- ❌ Inconsistent query keys

---

### State Management

**Read (in order):**

1. [State Management](./guides/03-STATE-MANAGEMENT.md) - Decision tree & patterns
2. [API Integration](./guides/04-API-INTEGRATION.md) - Server state (React Query)

**Reference examples:**

- `lib/store/authStore.ts` - Zustand store with persist
- `lib/hooks/use-auth.ts` - Custom hook
- See [Examples](./references/EXAMPLES.md#state-management)

**Decision tree:**

- Local UI state → `useState`
- Server data → React Query
- Global app state → Zustand

**Common mistakes to avoid:**

- ❌ Using `useState` for API data (use React Query)
- ❌ Selecting entire store (use selectors)
- ❌ Not persisting auth state

---

### Adding Translations

**Read (CRITICAL):**

1. [i18n Guide](./guides/06-I18N-GUIDE.md) - Complete i18n guide (MANDATORY)
2. [Anti-Patterns](./references/ANTI-PATTERNS.md) - Files with violations

**Reference examples:**

- `app/home-content.tsx` - ✅ Correct i18n usage
- `messages/vi.json` - Translation structure
- See [Examples](./references/EXAMPLES.md#components)

**Files needing i18n fixes:**

- ❌ `components/auth/login-form.tsx` - Hardcoded English
- ❌ `components/auth/register-form.tsx` - Hardcoded English
- ❌ `components/layout/header/navbar.tsx` - Hardcoded English
- ❌ `components/layout/footer.tsx` - Mixed text
- ❌ `components/layout/header/user-menu.tsx` - Hardcoded text

**Recently fixed (Phase 7):**

- ✅ `components/user/EditProfileForm.tsx` - Fixed namespace from "profile" to "user.profile"
- ✅ `components/user/ChangePasswordForm.tsx` - Fixed namespace from "profile" to "user.profile"
- ✅ `components/user/AvatarUpload.tsx` - Fixed namespace from "profile" to "user.profile"
- ✅ `app/(user)/profile/page.tsx` - Fixed namespace from "profile" to "user.profile"
- ✅ `app/(user)/profile/edit/page.tsx` - Fixed namespace from "profile" to "user.profile"

**Common mistakes to avoid:**

- ❌ ANY hardcoded text in JSX
- ❌ Hardcoded button labels
- ❌ Hardcoded form labels/placeholders
- ❌ Hardcoded error messages

---

### SEO/Metadata Work

**Read (in order):**

1. [SEO & Metadata](./guides/07-SEO-METADATA.md) - Complete SEO system
2. [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Server components

**Reference examples:**

- `lib/seo/config.ts` - Centralized SEO config
- `lib/seo/metadata.ts` - Metadata generators
- `lib/seo/json-ld.ts` - JSON-LD schemas
- `app/page.tsx` - Usage example
- See [Examples](./references/EXAMPLES.md#seo-configuration)

**Common mistakes to avoid:**

- ❌ Hardcoded metadata in pages
- ❌ Missing JSON-LD schemas
- ❌ No canonical URLs
- ❌ SEO data in i18n files

---

### Styling/UI Work

**Read (in order):**

1. [UI Components](./guides/08-UI-COMPONENTS.md) - shadcn/ui patterns
2. [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Component structure

**Reference examples:**

- `components/ui/*` - shadcn/ui base components
- `lib/utils.ts` - `cn()` utility

**Common mistakes to avoid:**

- ❌ Modifying `components/ui/` files directly
- ❌ Not using `cn()` for conditional classes
- ❌ Using native HTML elements instead of shadcn/ui

---

### Refactoring Existing Code

**Read (in order):**

1. [Anti-Patterns](./references/ANTI-PATTERNS.md) - What to fix
2. Relevant guide based on code type
3. [Checklist](./references/CHECKLIST.md) - Verification

**Files needing refactoring:**

- See [Anti-Patterns](./references/ANTI-PATTERNS.md#files-with-violations)

**Priority:**

1. HIGH: Auth forms, navigation (i18n violations)
2. MEDIUM: User menu, footer
3. LOW: TODO comments, commented code

---

### First-Time Setup

**Read (in order):**

1. [README](./README.md) - Overview and navigation
2. [Getting Started](./guides/00-GETTING-STARTED.md) - Setup & tech stack
3. [Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md) - Structure
4. [i18n Guide](./guides/06-I18N-GUIDE.md) - Translation rules (CRITICAL)
5. [Coding Standards](./references/CODING-STANDARDS.md) - Conventions
6. [Examples](./references/EXAMPLES.md) - Reference files

---

## 📂 By File Location

### Working in `/app/`

**Always read:**

- [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Server/Client split
- [SEO & Metadata](./guides/07-SEO-METADATA.md) - Page metadata
- [i18n Guide](./guides/06-I18N-GUIDE.md) - Translations

**For pages:**

- Export metadata (static or `generateMetadata()`)
- Add JSON-LD schemas
- Delegate to client components for interactivity

---

### Working in `/components/`

**Always read:**

- [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Structure & imports
- [UI Components](./guides/08-UI-COMPONENTS.md) - shadcn/ui usage
- [i18n Guide](./guides/06-I18N-GUIDE.md) - Translations

**Remember:**

- ALL text must use `useTranslations()`
- Use Next.js `<Image>` and `<Link>`
- Never modify `components/ui/`

---

### Working in `/lib/api/`

**Read:**

- [API Integration](./guides/04-API-INTEGRATION.md) - Complete guide
- [API Documentation](./API_DOCUMENTATION.md) - Backend specs

**Remember:**

- Use type-only imports: `import type { ... }`
- Add JSDoc comments
- Handle errors properly

---

### Working in `/lib/store/`

**Read:**

- [State Management](./guides/03-STATE-MANAGEMENT.md) - Zustand patterns

**Remember:**

- Separate state and actions
- Use persist middleware for auth
- Type everything properly

---

### Working in `/lib/validators/`

**Read:**

- [Forms & Validation](./guides/05-FORMS-VALIDATION.md) - Zod schemas

**Remember:**

- Define schema and infer type
- Add descriptive error messages
- Export both schema and type

---

### Working in `/lib/seo/`

**Read:**

- [SEO & Metadata](./guides/07-SEO-METADATA.md) - SEO system

**Remember:**

- Keep config centralized
- Create reusable generators
- Add JSON-LD schemas

---

### Working in `/messages/`

**Read:**

- [i18n Guide](./guides/06-I18N-GUIDE.md) - Translation organization

**Remember:**

- Organize by namespace (feature-based)
- Use descriptive keys
- NO SEO metadata here

---

## 🎭 By Role/Responsibility

### Frontend Developer

**Core guides:**

1. [Component Patterns](./guides/02-COMPONENT-PATTERNS.md)
2. [i18n Guide](./guides/06-I18N-GUIDE.md)
3. [UI Components](./guides/08-UI-COMPONENTS.md)
4. [Next.js Best Practices](./guides/09-NEXTJS-BEST-PRACTICES.md)

**Reference:**

- [Checklist](./references/CHECKLIST.md) before every commit

---

### Backend Integration Developer

**Core guides:**

1. [API Integration](./guides/04-API-INTEGRATION.md)
2. [State Management](./guides/03-STATE-MANAGEMENT.md)
3. [Forms & Validation](./guides/05-FORMS-VALIDATION.md)

**Reference:**

- [API Documentation](./API_DOCUMENTATION.md)

---

### SEO/Marketing Developer

**Core guides:**

1. [SEO & Metadata](./guides/07-SEO-METADATA.md)
2. [i18n Guide](./guides/06-I18N-GUIDE.md)
3. [Component Patterns](./guides/02-COMPONENT-PATTERNS.md)

---

## 🚨 Critical Rules (Always Check)

Before ANY commit, verify:

1. ✅ **i18n**: ALL text uses `useTranslations()` - [i18n Guide](./guides/06-I18N-GUIDE.md)
2. ✅ **SEO**: Use centralized config - [SEO Guide](./guides/07-SEO-METADATA.md)
3. ✅ **TypeScript**: NO `any` types - [Coding Standards](./references/CODING-STANDARDS.md)

**Full checklist**: [Pre-Commit Checklist](./references/CHECKLIST.md)

---

## 🎯 Common Scenarios

### "I need to add a login form"

**Read:**

- [Forms & Validation](./guides/05-FORMS-VALIDATION.md) - Form pattern
- [API Integration](./guides/04-API-INTEGRATION.md) - Login mutation
- [State Management](./guides/03-STATE-MANAGEMENT.md) - Auth state
- [i18n Guide](./guides/06-I18N-GUIDE.md) - Form labels

**Reference:**

- `lib/validators/auth.ts` - Validation schema
- `lib/api/endpoints/auth.ts` - Login endpoint
- `lib/store/authStore.ts` - Auth state

---

### "I need to add a password change form"

**Read:**

- [Forms & Validation](./guides/05-FORMS-VALIDATION.md) - Form pattern
- [API Integration](./guides/04-API-INTEGRATION.md) - Password change mutation
- [i18n Guide](./guides/06-I18N-GUIDE.md) - Password change translations
- [API Documentation](./API_DOCUMENTATION.md) - Password change endpoint

**Reference:**

- `types/user.ts` - `ChangePasswordData` interface
- `lib/validators/user-schemas.ts` - `changePasswordSchema` (Phase 2)
- `lib/hooks/use-profile.ts` - `useUpdatePassword` hook (Phase 3) - NEW
- `lib/api/endpoints/auth.ts` - `updateProfile` method
- `messages/vi.json` - Add `user.profile.*` translations

**Key requirements:**

- Use `ChangePasswordData` type (requires `current_password` for security)
- Use `changePasswordSchema` from `lib/validators/user-schemas.ts`
- All labels/messages must use i18n (`useTranslations("user.profile")`)
- Handle success/error states properly
- Update auth store after successful change

---

### "I need to create a user profile update form"

**Read:**

- [Forms & Validation](./guides/05-FORMS-VALIDATION.md) - User profile schemas (Phase 2)
- [API Integration](./guides/04-API-INTEGRATION.md) - Profile update mutation
- [i18n Guide](./guides/06-I18N-GUIDE.md) - Profile form translations
- [API Documentation](./API_DOCUMENTATION.md) - `PUT /auth/profile` endpoint

**Reference:**

- `types/user.ts` - `UpdateProfileData` interface
- `lib/validators/user-schemas.ts` - `updateProfileSchema` and `avatarFileSchema`
- `lib/hooks/use-profile.ts` - `useUpdateProfile` and `useUploadAvatar` hooks (Phase 3) - NEW
- `lib/api/endpoints/auth.ts` - `updateProfile` method
- `messages/vi.json` - Add `user.profile.*` translations (already exists)

**Key requirements:**

- Use `UpdateProfileData` type for partial updates
- Use `updateProfileSchema` for validation
- Use `avatarFileSchema` for avatar uploads
- All error messages use i18n keys (`user.profile.*`)
- Handle file uploads separately from text fields
- Preview avatar before upload

**Phase breakdown:**

- **Phase 2**: ✅ Schemas created in `lib/validators/user-schemas.ts`
- **Phase 3**: ✅ Hooks created in `lib/hooks/use-profile.ts` (`useUpdateProfile`, `useChangePassword`, `useAvatarUpload`)
- **Phase 4**: ✅ UI components created (`ProfileHeader`, `ProfileStats`, `ProfileAchievements`)
- **Phase 5**: ✅ Profile display page implemented
- **Phase 6**: ✅ Edit profile page implemented with forms and validation

---

### "I need to work on the edit profile page"

**Read:**

- [Phase 6 Documentation](./phase-6-profile-edit-documentation.md) - Complete implementation details
- [Forms & Validation](./guides/05-FORMS-VALIDATION.md) - Form patterns and validation
- [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Page structure and patterns
- [i18n Guide](./guides/06-I18N-GUIDE.md) - All text must be internationalized

**Reference:**

- `app/(user)/profile/edit/page.tsx` - Main edit profile page with metadata (Phase 6) - NEW
- `app/(user)/profile/edit/EditProfilePageClient.tsx` - Client component implementation (Phase 6) - NEW
- `components/user/edit-profile-form.tsx` - Profile edit form component
- `components/user/change-password-form.tsx` - Password change form component
- `components/user/avatar-upload.tsx` - Avatar upload component
- `lib/hooks/use-profile.ts` - Profile operation hooks (Phase 3)
- `messages/vi.json` - Edit profile translations in `profile.*` namespace

**Key features implemented:**

- Protected route requiring authentication
- Edit profile form with validation
- Password change form with security
- Avatar upload with preview
- All forms use Phase 3 hooks and Phase 2 validation
- Complete Vietnamese translations
- Automatic redirect to profile on success

**API endpoints used:**

- `PUT /auth/profile` - Update profile information (name, email, avatar, password)
  - Supports partial updates
  - Avatar upload via multipart/form-data
  - Password change requires current_password verification

---

### "I need to work on the user library functionality"

**Read:**

- [Phase 1 Library Hooks Documentation](./phase-1-library-hooks-documentation.md) - Complete hooks guide
- [State Management](./guides/03-STATE-MANAGEMENT.md) - React Query patterns and library hooks examples
- [API Integration](./guides/04-API-INTEGRATION.md) - Using hooks with API endpoints
- [API Documentation](./API_DOCUMENTATION.md#library-hooks-integration-phase-1) - Backend endpoint specs

**Reference:**

- `lib/hooks/use-library.ts` - All library React Query hooks (Phase 1) - NEW
  - `useFavorites()` - Fetch user's favorite manga with pagination
  - `useHistory()` - Fetch user's reading history with pagination
  - `useContinueReading()` - Fetch first 5 items for "Continue Reading" section
  - `useCompletedManga()` - Client-side filter for completed manga
  - `useRemoveFromHistory()` - Mutation to remove manga from history
  - `useLibraryPrefetch()` - Prefetch data for smooth UX

**Key features:**

- Automatic caching with 5-minute stale time
- Hierarchical query keys for efficient cache management
- Optimistic updates with automatic cache invalidation
- Pagination support for large datasets
- Prefetching for smooth tab switching
- Type-safe with TypeScript

**Usage example:**

```typescript
// In library page component
import {
  useFavorites,
  useHistory,
  useContinueReading,
} from "@/lib/hooks/use-library";

const { data: favorites, isLoading: favoritesLoading } = useFavorites({
  page: 1,
  per_page: 20,
});

const { data: history } = useHistory();
const { data: continueReading } = useContinueReading();
```

**API endpoints used:**

- `GET /user/favorites` - Fetch user's favorite manga
- `GET /user/histories` - Fetch user's reading history
- `DELETE /user/histories/{manga_id}` - Remove manga from history

---

### "I need to work on the profile display page"

**Read:**

- [Phase 5 Documentation](./phase-5-profile-display-documentation.md) - Complete implementation details
- [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Page structure and patterns
- [Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md) - Route structure
- [i18n Guide](./guides/06-I18N-GUIDE.md) - All text must be internationalized

**Reference:**

- `app/(user)/profile/page.tsx` - Main profile page component (Phase 5) - NEW
- `components/user/profile-header.tsx` - Profile header with avatar (Phase 4)
- `components/user/profile-stats.tsx` - User statistics display (Phase 4)
- `components/user/profile-achievements.tsx` - Achievement & pet display (Phase 4)
- `components/auth/protected-route.tsx` - Authentication wrapper
- `messages/vi.json` - Profile translations in `profile.*` namespace (Phase 5)

**Key features implemented:**

- Protected route requiring authentication
- Displays user info from GET /auth/profile API
- Shows statistics, achievements, and current pet
- Fully responsive design
- Loading skeleton states
- Complete Vietnamese translations

**API endpoint used:**

- `GET /auth/profile` - Fetches complete user profile with relationships

---

### "I need to use custom hooks for profile operations"

**Read:**

- [Forms & Validation](./guides/05-FORMS-VALIDATION.md#custom-hooks-for-form-operations-phase-3) - Phase 3 hooks documentation
- [Phase 3 Documentation](./phase-3-custom-hooks-documentation.md) - Complete hooks implementation guide
- [State Management](./guides/03-STATE-MANAGEMENT.md) - Store sync patterns

**Reference:**

- `lib/hooks/use-profile.ts` - All profile hooks (Phase 3) - NEW
  - `useUpdateProfile()` - Update name and email
  - `useUploadAvatar()` - Handle avatar uploads
  - `useUpdatePassword()` - Change password
- `lib/validators/user-schemas.ts` - Phase 2 validation schemas
- `lib/store/authStore.ts` - Auth store for sync

**Usage pattern:**

```typescript
const { updateProfile, isLoading, error } = useUpdateProfile();

const result = await updateProfile({ name: "New Name" });

if (result.success) {
  toast.success("Profile updated");
  // Store already synced
} else {
  toast.error(t(result.error));
}
```

**Key features:**

- All hooks validate with Phase 2 Zod schemas
- Return standardized `{ success, data?, error? }` pattern
- Profile/avatar hooks sync with Zustand auth store
- Error messages use i18n keys, not raw API errors
- Built-in loading states

---

### "I need to create a manga detail page"

**Read:**

- [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) - Page structure
- [SEO & Metadata](./guides/07-SEO-METADATA.md) - Dynamic metadata
- [API Integration](./guides/04-API-INTEGRATION.md) - Fetching data
- [i18n Guide](./guides/06-I18N-GUIDE.md) - Translations

**Reference:**

- `app/page.tsx` - Page pattern
- `lib/seo/metadata.ts` - Metadata generators

---

### "I need to fix hardcoded text"

**Read:**

- [i18n Guide](./guides/06-I18N-GUIDE.md) - Complete i18n guide
- [Anti-Patterns](./references/ANTI-PATTERNS.md) - Examples of violations

**Reference:**

- `app/home-content.tsx` - ✅ Correct usage
- `messages/vi.json` - Translation structure

---

### "I need to add a new shadcn/ui component"

**Read:**

- [UI Components](./guides/08-UI-COMPONENTS.md) - Adding components

**Command:**

```bash
pnpm dlx shadcn@latest add [component-name]
```

---

### "Before I commit..."

**Read:**

- [Checklist](./references/CHECKLIST.md) - Complete verification

**Quick checks:**

- ✅ No hardcoded text?
- ✅ Using centralized SEO?
- ✅ No `any` types?
- ✅ Files follow naming conventions?
- ✅ Conventional commit message?

---

## 🔄 Quick Links

| I need to...             | Read this                                                                 |
| ------------------------ | ------------------------------------------------------------------------- |
| Set up the project       | [Getting Started](./guides/00-GETTING-STARTED.md)                         |
| Understand the structure | [Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md)               |
| Create a component       | [Component Patterns](./guides/02-COMPONENT-PATTERNS.md)                   |
| Create a form            | [Forms & Validation](./guides/05-FORMS-VALIDATION.md)                     |
| Add translations         | [i18n Guide](./guides/06-I18N-GUIDE.md)                                   |
| Work with APIs           | [API Integration](./guides/04-API-INTEGRATION.md)                         |
| Add SEO metadata         | [SEO & Metadata](./guides/07-SEO-METADATA.md)                             |
| Use UI components        | [UI Components](./guides/08-UI-COMPONENTS.md)                             |
| Add password change      | [API Integration](./guides/04-API-INTEGRATION.md#password-change-pattern) |
| Work on profile page     | [Phase 5 Documentation](./phase-5-profile-display-documentation.md)       |
| Edit profile page        | [Phase 6 Documentation](./phase-6-profile-edit-documentation.md)          |
| Work on user library     | [Phase 1 Library Hooks](./phase-1-library-hooks-documentation.md)         |
| Fix i18n translations    | [Phase 7 Documentation](./phase-7-i18n-completion-documentation.md)       |
| Optimize Next.js         | [Next.js Best Practices](./guides/09-NEXTJS-BEST-PRACTICES.md)            |
| Check before commit      | [Checklist](./references/CHECKLIST.md)                                    |
| See good examples        | [Examples](./references/EXAMPLES.md)                                      |
| Avoid mistakes           | [Anti-Patterns](./references/ANTI-PATTERNS.md)                            |

---

## 📚 All Documentation

**[← Back to Documentation Index](./README.md)**

---

**Last updated**: 2025-12-04 (Phase 1 library hooks)
