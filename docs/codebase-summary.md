# Codebase Summary

This document provides an overview of the Manga Reader CMS codebase structure, architecture, and implementation details.

## Project Overview

A modern manga reading platform built with Next.js 16 + React 19 + TypeScript, featuring:

- **Frontend**: Next.js 16 with App Router, React 19, TypeScript 5+
- **Backend API**: Laravel-based REST API at `http://localhost:8000/api/v1`
- **UI**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Zustand for global state, TanStack Query v5 for server state
- **Internationalization**: next-intl (default: Vietnamese)
- **Package Manager**: pnpm 10.17.1

## Architecture

### Directory Structure

```
manga-reader-sd/
├── app/                     # Next.js App Router (pages & layouts)
│   ├── (auth)/             # Authentication pages
│   ├── (manga)/            # Manga browsing & reading
│   ├── (user)/             # User profile & library
│   └── api/                # API routes (if any)
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── manga/              # Manga-specific components
│   ├── auth/               # Authentication components
│   ├── library/            # User library components
│   └── layout/             # Layout components
├── lib/
│   ├── api/                # API client & endpoints
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   ├── validators/         # Zod validation schemas
│   ├── utils/              # Helper functions
│   └── seo/                # SEO configuration
├── types/                  # TypeScript type definitions
├── messages/               # i18n translation files
└── docs/                   # Documentation
```

### Technology Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**:
  - Zustand (global state)
  - TanStack Query v5 (server state)
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Package Manager**: pnpm

## Implementation Phases

### Phase 1: Core Setup ✅

- Project structure established
- Development environment configured
- API client infrastructure
- Base UI components
- SEO & i18n infrastructure

### Phase 2: Authentication & User Management ✅

- Zustand auth store with persistence
- Login/register pages
- Google OAuth integration
- Protected routes
- Validation schemas for user operations

### Phase 3: Custom Hooks for Profile Operations ✅

**Newly Implemented:**

- `useUpdateProfile()` - Updates user name and email
- `useUploadAvatar()` - Handles avatar file uploads
- `useUpdatePassword()` - Changes user password

**Key Features:**

- All hooks validate with Phase 2 Zod schemas
- Return standardized `{ success, data?, error? }` pattern
- Profile/avatar hooks sync with Zustand auth store
- Error messages use i18n keys, not raw API errors
- Built-in loading states

**Files Created/Updated:**

- `lib/hooks/use-profile.ts` - Custom hooks implementation
- `messages/vi.json` - Added error message keys
- `lib/hooks/index.ts` - Export barrel updated

### Phase 4: UI Components ✅

- Profile display and edit components
- Avatar upload with preview
- Password change form
- Responsive design patterns

### Phase 5: User Library Implementation ✅

**Phase 5.1: Library Hooks (Phase 1) ✅**

Created comprehensive React Query hooks for user library data management:

- `useFavorites()` - Fetch user's favorite manga with pagination
- `useHistory()` - Fetch user's reading history with pagination
- `useContinueReading()` - Get first 5 items from history
- `useCompletedManga()` - Filter favorites for completed manga
- `useRemoveFromHistory()` - Remove items from reading history
- `useRemoveBookmark()` - Remove items from favorites
- `useLibraryPrefetch()` - Prefetch data for smooth UX

**Key Features:**

- Hierarchical query keys for efficient cache management
- 5-minute stale time for optimal performance
- Automatic cache invalidation on mutations
- Proper error handling and loading states

**Phase 5.2: Library Page Structure (Phase 2) ✅**

Implemented responsive tab-based library page with:

- Protected route pattern (Server Wrapper → Client Content)
- URL state management for tab persistence
- Responsive tab navigation (2x2 mobile, 1x4 desktop)
- Prefetching strategy for smooth UX
- Loading skeletons and error states

**Phase 5.3: Library Tab Content (Phase 3) ✅**

Completed implementation of all library components:

- `LibraryMangaCard` - Reusable card with progress tracking & remove actions
- `LibraryPagination` - Custom pagination for library grids
- `EmptyState` - Contextual empty states for each tab
- `ContinueReadingSection` - Progress tracking with "View All" link
- `BookmarksTab` - Paginated favorites with remove functionality
- `HistoryTab` - Chronological reading list with remove actions
- `CompletedTab` - Filtered view of completed manga

**Key Features:**

- Progress bars showing reading percentage
- Time ago display for history items
- Internationalized text throughout
- Mobile-responsive design
- Accessibility compliance (WCAG 2.1 AA)

**Phase 5.4: Empty States & Skeletons (Phase 4) ✅**

Enhanced user experience with contextual empty states and loading skeletons:

- `EmptyState` component with color-coded icons (blue for continue, amber for bookmarks, etc.)
- `TabContentSkeleton` with configurable grid counts
- `ContinueReadingSkeleton` matching exact layout
- `MangaCardSkeleton` with 3:4 aspect ratio
- Zero layout shift implementation
- Performance-optimized CSS animations

**Phase 5.5: i18n Translations (Phase 5) ✅**

Complete Vietnamese translations for all library UI elements:

- 51 translation keys in `messages/vi.json`
- Responsive labels (full for desktop, short for mobile)
- Contextual empty state messages
- Dynamic interpolation for counts and chapters
- Error and success message translations
- 100% i18n compliance - no hardcoded strings

### Phase 4: UI Components ✅

User profile UI components implemented:

- ProfileHeader - User avatar, name, email display
- ProfileStats - Points and reading statistics
- ProfileAchievements - User achievements and pets display

### Phase 6: Profile Display Page ✅

**Completed Implementation:**

- Profile page component at `/app/(user)/profile/page.tsx`
- Protected route with authentication check
- Comprehensive Vietnamese translations for profile section
- Loading skeleton states for better UX
- Responsive design with Tailwind CSS

**Key Features:**

- Displays user information from GET /auth/profile API
- Shows user statistics (points, achievements)
- Current pet and achievement display
- Internationalized all text content
- Clean, modern UI with shadcn/ui components

### Phase 6: Profile Editing (Planned)

Interactive profile editing features:

- Update profile form
- Avatar upload component
- Password change form

## Key Patterns

### Form Validation Pattern

1. **Phase 2**: Define Zod schemas in `lib/validators/`
2. **Phase 3**: Create custom hooks that use schemas
3. **Phase 4**: Build UI components that use hooks

```typescript
// Phase 2: Validation schema
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
});

// Phase 3: Custom hook
export function useUpdateProfile() {
  const updateProfile = useCallback(async (data) => {
    const validated = updateProfileSchema.parse(data);
    const updatedUser = await authApi.updateProfile(validated);
    updateUser(updatedUser); // Sync store
    return { success: true, data: updatedUser };
  }, []);

  return { updateProfile, isLoading, error };
}

// Phase 4: UI Component
export function UpdateProfileForm() {
  const { updateProfile, isLoading } = useUpdateProfile();
  // Form implementation with React Hook Form
}
```

### State Management

- **Local UI State**: `useState`, `useReducer`
- **Server Data**: TanStack Query (React Query) with SSR support
- **Global State**: Zustand with persistence

### Server-Side Rendering (SSR) Implementation

**Phase 01: SSR Prefetch Pattern ✅**

Implemented server-side rendering with TanStack Query for improved performance and SEO:

**Key Components:**

- **QueryClient Factory** (`lib/api/query-client.ts`)
  - Uses React's `cache()` for request-scoped QueryClient instances
  - Server-optimized default options (1-minute stale time, no window focus)
  - Prevents memory leaks and ensures request isolation

- **Browse Page SSR** (`app/(manga)/browse/page.tsx`)
  - Prefetches manga list and genres in parallel on server
  - Uses `HydrationBoundary` to transfer cache to client
  - Implements streaming with `Suspense` boundaries
  - Includes proper loading skeleton (`BrowseSkeleton`)

- **SSR Pattern Benefits:**
  - Faster First Contentful Paint (FCP)
  - Better SEO with content in initial HTML
  - Improved user experience with no loading spinners
  - Progressive loading with React Suspense

**Implementation Pattern:**

```tsx
// Server-side prefetch
async function prefetchData() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["manga-list", params],
      queryFn: () => fetchMangaList(params),
      staleTime: 30 * 1000, // 30 seconds
    }),
    queryClient.prefetchQuery({
      queryKey: ["genres"],
      queryFn: () => fetchGenres(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
  ]);

  return dehydrate(queryClient);
}

// Page component
export default async function Page() {
  const dehydratedState = await prefetchData();

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>
    </HydrationBoundary>
  );
}
```

### Error Handling

- **Sanitized Errors**: Hooks return i18n keys, not raw API errors
- **Consistent Pattern**: All operations return `{ success, data?, error? }`
- **User Feedback**: Toast notifications for success/error states

## API Integration

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/google` - Google OAuth
- `GET /auth/profile` - Get current user with relationships
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - User logout

### Frontend Routes

- `GET /profile` - User profile display page (protected route)

### API Client Features

- Axios-based client with interceptors
- Automatic token handling
- Error interceptors
- FormData support for file uploads

## Internationalization

- **Default Locale**: Vietnamese (vi)
- **Translation Files**: `messages/vi.json`
- **Usage**: All UI text uses `useTranslations()` hook
- **Namespace Organization**: Structured by feature (e.g., `user.profile.*`)

## SEO Configuration

- **Centralized Config**: `lib/seo/` directory
- **Dynamic Metadata**: Page-specific metadata generation
- **JSON-LD Schemas**: Structured data for search engines
- **Open Graph**: Social media metadata

## Development Workflow

### Before Committing

1. ✅ No hardcoded text (use i18n)
2. ✅ Use centralized SEO configuration
3. ✅ No `any` types
4. ✅ Run type-check and lint
5. ✅ Follow conventional commits

### Commands

```bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm type-check       # TypeScript check
pnpm lint             # ESLint
```

## Current Status

**Completed:**

- Phase 1: Core infrastructure
- Phase 2: Authentication system
- Phase 3: Profile management hooks
- Phase 4: User profile UI components
- Phase 5: Profile display page implementation
- Phase 6: User library implementation (favorites, history, continue reading)
- Phase 7: Comments system (reading, posting, emoji reactions & Refinement Phase 01)
- Phase 01: SSR prefetch pattern implementation

**In Progress:**

- None

**Planned:**

- Phase 6: Profile editing functionality
- Phase 8: Polish & Optimization

## Documentation

- **Getting Started**: `/docs/guides/00-GETTING-STARTED.md`
- **Architecture**: `/docs/guides/01-PROJECT-ARCHITECTURE.md`
- **Forms Guide**: `/docs/guides/05-FORMS-VALIDATION.md`
- **API Docs**: `/docs/API_DOCUMENTATION.md`
- **Task Mapping**: `/docs/TASK-TO-DOCS-MAPPING.md`
- **SSR Implementation**: `/docs/guides/11-SSR-IMPLEMENTATION.md` ⭐ **NEW**
- **Phase 5 Documentation**: `/docs/phase-5-profile-display-documentation.md`

---

**Last Updated**: 2025-12-19
**Version**: 0.1.1
**Phase**: 01 (SSR Implementation & Comment Refinement Complete)
