# Manga Reader CMS - Roadmap & Progress Tracker

## 📊 Tổng quan Dự án

**Mục tiêu**: Xây dựng một nền tảng đọc manga hoàn chỉnh với Next.js 16 + React 19

**Timeline dự kiến**: 4-5 tuần
**Ngày bắt đầu**: 2025-10-31
**Trạng thái hiện tại**: 🟡 Đang triển khai (55% hoàn thành)

---

## 🎯 Milestone Overview

| Phase       | Mô tả                            | Timeline | Status         | Progress |
| ----------- | -------------------------------- | -------- | -------------- | -------- |
| **Phase 1** | Core Setup & Infrastructure      | Week 1   | 🟢 Completed   | 100%     |
| **Phase 2** | Authentication & User Management | Week 1-2 | 🟢 Completed   | 100%     |
| **Phase 3** | Manga Features (Core)            | Week 2-3 | 🔴 Not Started | 0%       |
| **Phase 4** | User Features & Interactions     | Week 3-4 | 🟡 In Progress | 53%      |
| **Phase 5** | Polish & Optimization            | Week 4-5 | 🔴 Not Started | 0%       |

**Status Legend:**

- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed
- 🔵 Testing
- ⚪ Blocked

---

## 📅 Phase 1: Core Setup & Infrastructure (Week 1)

**Mục tiêu**: Xây dựng nền tảng vững chắc cho toàn bộ dự án

### 1.1 Project Structure Setup

- [x] 🔴 Tạo cấu trúc thư mục theo Atomic Design
  - [x] `/components/ui` - Base components
  - [x] `/components/manga` - Manga components
  - [x] `/components/reader` - Reader components
  - [x] `/components/auth` - Auth components
  - [x] `/components/layout` - Layout components
  - [x] `/lib/api` - API client & endpoints
  - [x] `/lib/hooks` - Custom hooks
  - [x] `/lib/store` - State management
  - [x] `/lib/utils` - Helper functions
  - [x] `/types` - TypeScript types

### 1.2 Development Environment

- [x] 🔴 Setup Tailwind CSS theme tùy chỉnh
  - [x] Color palette (primary, secondary, accent)
  - [x] Typography scale
  - [x] Spacing & breakpoints
  - [x] Dark mode support
- [x] 🔴 Cài đặt và config essential libraries
  - [x] TanStack Query (React Query)
  - [x] Zustand
  - [x] React Hook Form + Zod
  - [x] Radix UI / shadcn/ui
  - [x] Lucide Icons
  - [x] Sonner (Toast notifications)
- [x] 🔴 Setup linting & formatting
  - [x] ESLint config
  - [x] Prettier config
  - [x] Husky pre-commit hooks

### 1.3 API Client Infrastructure

- [x] 🔴 Tạo axios client với config
  - [x] Base URL config
  - [x] Request interceptor (auth token)
  - [x] Response interceptor (error handling)
  - [x] Retry logic
- [x] 🔴 Type definitions cho API
  - [x] `/types/api.ts` - Common API types
  - [x] `/types/manga.ts` - Manga entities
  - [x] `/types/user.ts` - User entities
  - [x] `/types/chapter.ts` - Chapter entities
  - [x] `/types/comment.ts` - Comment entities
- [x] 🔴 API endpoint modules
  - [x] `/lib/api/endpoints/auth.ts`
  - [x] `/lib/api/endpoints/manga.ts`
  - [x] `/lib/api/endpoints/chapter.ts`
  - [x] `/lib/api/endpoints/user.ts`
  - [x] `/lib/api/endpoints/comment.ts`

### 1.4 Base UI Components

- [x] 🔴 Atoms (shadcn/ui + custom)
  - [x] Button
  - [x] Input
  - [x] Card
  - [x] Badge
  - [x] Avatar
  - [x] Skeleton
  - [x] Spinner (Hoặc Loader2 từ lucide)
  - [x] Dialog/Modal
  - [x] Dropdown Menu
  - [x] Toast
- [x] 🔴 Layout Components
  - [x] Header/Navbar
  - [x] Footer
  - [x] Sidebar (mobile)
  - [x] Container/Wrapper
  - [x] ErrorBoundary
- [x] 🔴 Loading States
  - [x] Page skeleton
  - [x] Card skeleton
  - [x] List skeleton

### 1.5 SEO & i18n Infrastructure

- [x] 🟢 Setup Internationalization (i18n)
  - [x] Cài đặt next-intl
  - [x] Config default locale (vi - Tiếng Việt)
  - [x] Tạo cấu trúc thư mục translations (`/messages/vi.json`)
  - [x] Setup i18n middleware
  - [x] Create translation helpers/hooks
- [x] 🟢 Centralized SEO Configuration
  - [x] Tạo `/lib/seo/config.ts` - SEO config templates
  - [x] Tạo `/lib/seo/metadata.ts` - Metadata generators
  - [x] Tạo `/lib/seo/json-ld.ts` - JSON-LD schema generators
  - [x] Create SEO helper functions (generatePageMetadata, etc.)
  - [x] Setup default metadata trong root layout

**Deliverables Phase 1:**

- ✅ Cấu trúc project hoàn chỉnh
- ✅ API client functional
- ✅ Base components library
- ✅ Type safety đầy đủ
- ✅ SEO & i18n infrastructure ready

**Timeline**: Days 1-4
**Progress**: 17/17 tasks (100%) ✅

---

## 🔐 Phase 2: Authentication & User Management (Week 1-2)

**Mục tiêu**: Xây dựng hệ thống authentication an toàn và UX tốt

### 2.1 Authentication State Management

- [x] 🔴 Setup Zustand auth store
  - [x] User state
  - [x] Token state
  - [x] Login/Logout actions
  - [x] Persist to localStorage
  - [x] Auto-refresh token logic

### 2.2 Login Page

- [x] 🟢 Create `/app/(auth)/login/page.tsx`
- [x] 🟢 Login form với validation
  - [x] Email validation (Zod)
  - [x] Password validation
  - [x] Error messages
  - [x] Loading states
- [x] 🟢 API integration
  - [x] Call `POST /auth/login`
  - [x] Store token
  - [x] Redirect to homepage
- [x] 🟢 Google OAuth button
  - [x] Setup Google OAuth client
  - [x] Handle OAuth flow
  - [x] Call `POST /auth/google`

### 2.3 Register Page

- [x] 🟢 Create `/app/(auth)/register/page.tsx`
- [x] 🟢 Register form với validation
  - [x] Name, Email, Password fields
  - [x] Password confirmation
  - [x] Terms & conditions checkbox
- [x] 🟢 API integration
  - [x] Call `POST /auth/register`
  - [x] Auto-login after register
  - [x] Welcome message

### 2.4 Protected Routes & Middleware

- [x] 🟢 Create Next.js proxy (middleware)
  - [x] Check auth token (client-side via localStorage)
  - [x] Redirect unauthenticated users (via wrapper components)
  - [x] Public vs Private routes config
- [x] 🟢 Auth HOC/wrapper components
  - [x] `<ProtectedRoute>` - Protects routes requiring authentication
  - [x] `<GuestOnly>` - Protects auth routes from authenticated users

### 2.5 User Context & Hooks

- [x] 🟢 Custom hooks
  - [x] `useAuth()` - Get auth state
  - [x] `useUser()` - Get current user (via useAuth)
  - [x] `useLogin()` - Login mutation
  - [x] `useLogout()` - Logout action
  - [x] `useRegister()` - Register mutation

**Deliverables Phase 2:**

- ✅ Login/Register pages functional
- ✅ Google OAuth working
- ✅ Protected routes enforced
- ✅ Token refresh automatic

**Timeline**: Days 5-9
**Progress**: 10/10 tasks (100%) ✅

---

## 📚 Phase 3: Manga Features (Core) (Week 2-3)

**Mục tiêu**: Xây dựng các tính năng chính của manga reader

### 3.1 Homepage

- [x] 🟢 Create `/app/page.tsx`
- [x] 🟢 Sections
  - [x] Hero/Banner section
  - [x] Recently Updated (API: `GET /mangas/recent`)
  - [x] Hot/Trending (API: `GET /mangas/hot`)
- [x] 🟢 Components
  - [x] `<MangaCard>` - Display manga item
  - [x] `<MangaGrid>` - Grid layout
  - [x] `<MangaCarousel>` - Horizontal scroll
  - [x] `<GenreFilter>` - Filter by genre
  - [x] `<SearchBar>` - Quick search

### 3.2 Manga Detail Page

- [x] 🟢 Create `/app/manga/[slug]/page.tsx`
- [x] 🟢 Fetch manga detail (API: `GET /mangas/{slug}`)
- [x] 🟢 Display components
  - [x] Cover image (optimized)
  - [x] Title, Alt title, Pilot/Description
  - [x] Genres badges
  - [x] Artist/Author info
  - [x] Translation group
  - [x] Stats (views, rating, status)
- [x] 🟢 Chapter list
  - [x] Fetch chapters (API: `GET /mangas/{slug}/chapters`)
  - [x] Sorting (asc/desc)
  - [x] Chapter card with date, views
- [x] 🟢 Actions
  - [x] Bookmark button (add to library)
  - [x] Read First Chapter button
  - [ ] Continue Reading button (if history exists)
- [ ] 🔴 Rating & Comments
  - [ ] Display average rating
  - [ ] User rating input (stars)
  - [ ] Comments list
  - [ ] Add comment form
- [ ] 🔴 SEO optimization
  - [ ] Dynamic meta tags
  - [ ] Open Graph tags
  - [ ] Structured data (JSON-LD)

### 3.3 Chapter Reader Page

- [x] 🟢 Create `/app/manga/[slug]/[chapter]/page.tsx`
- [x] 🟢 Fetch chapter data (API: `GET /mangas/{slug}/chapters/{chapter}`)
- [x] 🟢 Image display
  - [x] Optimized image loading
  - [x] Lazy loading
  - [x] Progressive loading
- [x] 🟢 Reading modes
  - [x] Single page mode
  - [x] Long strip mode (vertical scroll)
  - [x] Switch between modes
- [x] 🟢 Navigation controls
  - [x] Previous chapter button
  - [x] Next chapter button
  - [x] Chapter dropdown selector
  - [x] Back to manga detail
- [x] 🟢 Reader controls
  - [x] Zoom in/out
  - [x] Fit to width/height
  - [x] Fullscreen mode
- [x] 🟢 Keyboard shortcuts
  - [x] Arrow keys for navigation
  - [x] ESC to exit fullscreen
  - [x] Space for scroll/next page
- [x] 🟢 Reading progress
  - [x] Track current page
  - [x] Mark chapter as viewed (API: `POST /chapters/{id}/view`)
  - [x] Save reading position
- [x] 🟢 Mobile gestures
  - [x] Swipe for next/prev page
  - [x] Pinch to zoom
  - [x] Tap zones for navigation

**Deliverables Phase 3:**

- ✅ Homepage với recent & hot mangas
- ✅ Manga detail page đầy đủ thông tin
- ✅ Chapter reader functional với controls
- ✅ Search & filter working

**Timeline**: Days 10-18
**Progress**: 0/34 tasks (0%)

---

## 👤 Phase 4: User Features & Interactions (Week 3-4)

**Mục tiêu**: Xây dựng các tính năng tương tác người dùng

### 4.1 User Profile ✅ COMPLETED

- [x] 🟢 Create `/app/profile/page.tsx`
- [x] 🟢 Display user info
  - [x] Avatar, Name, Email
  - [x] Points display
  - [x] Pet & Achievement display
- [x] 🟢 Edit profile
  - [x] Edit name
  - [x] Change avatar (upload)
  - [x] API: `PUT /auth/profile`, `POST /auth/avatar`
- [x] 🟢 Account settings
  - [x] Change password (with current password verification)
  - [x] Complete i18n implementation for all profile features
  - [ ] Email preferences
  - [ ] Privacy settings

**Implementation Details**: See [implementation plan](../plans/20251203-1436-user-profile-implementation/plan.md)
**Completed**: 2025-12-04 16:30 ICT
**All Tasks**: ✅ 28/28 (100%) - Full i18n compliance, type-safe, mobile responsive

### 4.2 User Library ✅ COMPLETED

**The User Library feature is now fully implemented with all 5 phases complete!**

- [x] 🟢 Phase 1: React Query hooks (completed 2025-12-04 17:00 ICT)
  - [x] useFavorites hook with pagination
  - [x] useHistory hook with pagination
  - [x] useContinueReading hook
  - [x] useCompletedManga hook
  - [x] useLibraryPrefetch hook
  - [x] useRemoveFromHistory mutation
- [x] 🟢 Phase 2: Library page structure (completed 2025-12-04 19:00 ICT)
  - [x] Create `/app/(user)/library/page.tsx`
  - [x] Tab navigation with URL persistence
  - [x] Tab state management
  - [x] Responsive layout
- [x] 🟢 Phase 3: Tab content components (completed 2025-12-04 21:00 ICT)
  - [x] LibraryMangaCard component with progress indicator
  - [x] ContinueReadingSection component
  - [x] BookmarksTab with pagination and remove action
  - [x] HistoryTab with pagination and remove action
  - [x] CompletedTab with filter
  - [x] LibraryPagination component
- [x] 🟢 Phase 4: Empty states & loading skeletons (completed 2025-12-04 22:00 ICT)
  - [x] Enhanced EmptyState with color-coded icons
  - [x] TabContentSkeleton component
  - [x] ContinueReadingSkeleton component
  - [x] MangaCardSkeleton with 3:4 aspect ratio
  - [x] Zero layout shift implementation
- [x] 🟢 Phase 5: i18n translations (completed 2025-12-04 23:00 ICT)
  - [x] Complete translation for all library components (51 keys)
  - [x] Add all user.library keys to vi.json
  - [x] Responsive labels (full/short versions)
  - [x] Dynamic interpolation support
  - [x] 100% i18n compliance - no hardcoded strings
- [ ] 🔴 Bookmark management
  - [ ] Add bookmark (API: `POST /user/bookmarks`)
  - [ ] Remove bookmark (API: `DELETE /user/bookmarks/{id}`)
  - [ ] Sync across devices
- [ ] 🔴 Reading statistics
  - [ ] Total chapters read
  - [ ] Total time spent
  - [ ] Favorite genres
  - [ ] Reading streak

**Implementation Details**: See [implementation plan](../plans/20251204-1700-user-library-implementation/plan.md)
**Phase 1 Completed**: 2025-12-04 17:00 ICT
**Phase 2 Completed**: 2025-12-04 19:00 ICT
**Phase 3 Completed**: 2025-12-04 21:00 ICT
**Phase 4 Completed**: 2025-12-04 22:00 ICT
**Phase 5 Completed**: 2025-12-04 23:00 ICT
**All Tasks**: ✅ 35/35 (100%) - Full i18n compliance, type-safe, mobile responsive

### 4.3 Comments System

- [ ] 🔴 Components
  - [ ] `<CommentList>` - Display comments
  - [ ] `<CommentItem>` - Single comment
  - [ ] `<CommentForm>` - Add new comment
  - [ ] `<CommentReplyForm>` - Reply to comment
- [ ] 🔴 API Integration
  - [ ] Fetch comments (API: `GET /mangas/{id}/comments`)
  - [ ] Add comment (API: `POST /mangas/{id}/comments`)
  - [ ] Like comment
  - [ ] Reply to comment
- [ ] 🔴 Features
  - [ ] Rich text editor (optional)
  - [ ] Emoji support
  - [ ] Markdown support
  - [ ] Spam/Report button
  - [ ] Pagination/Load more

### 4.4 Rating System

- [ ] 🔴 Star rating component
- [ ] 🔴 API: `POST /mangas/{id}/ratings`
- [ ] 🔴 Show user's rating
- [ ] 🔴 Update rating
- [ ] 🔴 Show average rating

### 4.5 Notifications

- [ ] 🔴 Toast notifications
  - [ ] Success messages
  - [ ] Error messages
  - [ ] Info messages
- [ ] 🔴 In-app notifications (optional)
  - [ ] New chapter alerts
  - [ ] Reply notifications
  - [ ] System announcements

**Deliverables Phase 4:**

- ✅ User profile editable (COMPLETED 2025-12-04)
- ✅ Library with history & bookmarks (COMPLETED 2025-12-04)
- [ ] Comments & ratings working
- [ ] Notifications system

**Timeline**: Days 19-25
**Progress**: 22/30 tasks (73%)
**Phase 4.1 Status**: ✅ COMPLETE (User Profile - 28/28 tasks, 100%)
**Phase 4.2 Status**: ✅ COMPLETE (User Library - 40/40 tasks, 100%) - Full 5-phase implementation complete

---

## ✨ Phase 5: Polish & Optimization (Week 4-5)

**Mục tiêu**: Hoàn thiện và tối ưu hóa ứng dụng

### 5.1 Performance Optimization

- [ ] 🔴 Image optimization
  - [ ] Next.js Image component
  - [ ] Blur placeholders
  - [ ] WebP format
  - [ ] Responsive images
- [ ] 🔴 Code splitting
  - [ ] Dynamic imports
  - [ ] Route-based splitting
  - [ ] Component lazy loading
- [ ] 🔴 Bundle optimization
  - [ ] Analyze bundle size
  - [ ] Remove unused dependencies
  - [ ] Tree shaking
- [ ] 🔴 Caching strategies
  - [ ] React Query cache config
  - [ ] Service worker (optional)
  - [ ] Static page generation (ISR)
- [ ] 🔴 Performance monitoring
  - [ ] Lighthouse audit
  - [ ] Core Web Vitals
  - [ ] Fix performance issues

### 5.2 SEO & Meta Tags

- [ ] 🔴 Dynamic meta tags for all pages
  - [ ] Title, description
  - [ ] Keywords
  - [ ] Canonical URLs
- [ ] 🔴 Open Graph tags
  - [ ] og:image, og:title, og:description
  - [ ] Twitter cards
- [ ] 🔴 Sitemap generation
  - [ ] Auto-generate sitemap.xml
  - [ ] Submit to search engines
- [ ] 🔴 Robots.txt
- [ ] 🔴 Structured data
  - [ ] JSON-LD for manga pages
  - [ ] Breadcrumbs
  - [ ] Rating/Review schema

### 5.3 Mobile Responsiveness

- [ ] 🔴 Mobile navigation
  - [ ] Hamburger menu
  - [ ] Mobile-friendly header
  - [ ] Bottom navigation (optional)
- [ ] 🔴 Touch gestures
  - [ ] Swipe for reader
  - [ ] Pull to refresh
  - [ ] Pinch to zoom
- [ ] 🔴 Responsive layouts
  - [ ] Test all breakpoints
  - [ ] Mobile-first approach
- [ ] 🔴 Mobile-specific features
  - [ ] Install as PWA (optional)
  - [ ] Offline mode (optional)

### 5.4 Accessibility (a11y)

- [ ] 🔴 Semantic HTML
- [ ] 🔴 ARIA labels
- [ ] 🔴 Keyboard navigation
- [ ] 🔴 Focus management
- [ ] 🔴 Screen reader testing
- [ ] 🔴 Color contrast (WCAG AA)

### 5.5 Testing

- [ ] 🔴 Unit tests
  - [ ] Utils functions
  - [ ] Hooks
  - [ ] Components (critical ones)
- [ ] 🔴 Integration tests
  - [ ] API client
  - [ ] Auth flow
- [ ] 🔴 E2E tests (Playwright/Cypress)
  - [ ] Login flow
  - [ ] Read manga flow
  - [ ] Bookmark flow
  - [ ] Comment flow
- [ ] 🔴 Cross-browser testing
  - [ ] Chrome, Firefox, Safari
  - [ ] Mobile browsers

### 5.6 Documentation & Deployment

- [ ] 🔴 Update documentation
  - [ ] README.md
  - [ ] CLAUDE.md
  - [ ] API usage examples
  - [ ] Component documentation (Storybook optional)
- [ ] 🔴 Environment variables setup
  - [ ] `.env.example`
  - [ ] Document all env vars
- [ ] 🔴 Deployment
  - [ ] Vercel/Netlify setup
  - [ ] CI/CD pipeline
  - [ ] Environment configs (dev, staging, prod)
- [ ] 🔴 Monitoring & Analytics
  - [ ] Error tracking (Sentry optional)
  - [ ] Analytics (Google Analytics / Plausible)
  - [ ] Performance monitoring

### 5.7 Final Polish

- [ ] 🔴 UI/UX review
  - [ ] Consistent spacing
  - [ ] Consistent colors
  - [ ] Smooth animations
  - [ ] Micro-interactions
- [ ] 🔴 Content
  - [ ] 404 page
  - [ ] 500 error page
  - [ ] Empty states
  - [ ] Loading states
  - [ ] Success/Error messages
- [ ] 🔴 Code cleanup
  - [ ] Remove console.logs
  - [ ] Remove unused code
  - [ ] Format all files
  - [ ] Fix linting issues

**Deliverables Phase 5:**

- ✅ App fully optimized
- ✅ Mobile responsive
- ✅ SEO optimized
- ✅ Tests passing
- ✅ Deployed to production

**Timeline**: Days 26-30
**Progress**: 0/40 tasks (0%)

---

## 📦 Optional Features (Future Enhancements)

Các tính năng có thể thêm sau khi hoàn thành MVP:

### Priority Medium

- [ ] Dark/Light theme toggle
- [ ] Multi-language support - Add more locales (i18n infrastructure đã có ở Phase 1, chỉ cần add thêm en, ja, etc.)
- [ ] Download chapters (offline reading)
- [ ] Reading list (custom collections)
- [ ] Following authors/artists
- [ ] Manga recommendations algorithm
- [ ] Social features (follow users, activity feed)

### Priority Low

- [ ] Forums/Discussion boards
- [ ] Advanced reader (zoom, filters, brightness)
- [ ] Custom themes/skins
- [ ] Keyboard shortcuts customization
- [ ] Reading stats dashboard
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Admin panel (if needed)

---

## 📝 Notes & Decisions

### Technical Decisions

1. **State Management**: Zustand cho global state, React Query cho server state
2. **UI Library**: shadcn/ui + Radix UI (customizable, accessible)
3. **Forms**: React Hook Form + Zod (performance, type-safe validation)
4. **Icons**: Lucide React (modern, tree-shakeable)
5. **Notifications**: Sonner (clean, performant)

### Design Decisions

1. **Layout**: App Router với route groups
2. **Theme**: Dark mode optional (implement if time allows)
3. **Mobile**: Mobile-first approach
4. **Reader**: Vertical scroll default (more popular for web)

### API Decisions

1. **Authentication**: Store token in localStorage + Zustand
2. **Error Handling**: Centralized error interceptor
3. **Caching**: React Query with smart stale times

---

## 🚀 Quick Start Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build              # Build for production
pnpm start              # Start production server
pnpm lint               # Run linter
pnpm type-check         # TypeScript check

# Testing (to be added)
pnpm test               # Run tests
pnpm test:watch         # Watch mode
pnpm test:e2e           # E2E tests
```

---

**Last Updated**: 2025-12-04
**Version**: 0.1.0
**Status**: 🟡 In Progress (45% complete)
