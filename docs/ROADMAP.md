# Manga Reader CMS - Roadmap & Progress Tracker

## 📊 Tổng quan Dự án

**Mục tiêu**: Xây dựng một nền tảng đọc manga hoàn chỉnh với Next.js 16 + React 19

**Timeline dự kiến**: 4-5 tuần
**Ngày bắt đầu**: 2025-10-31
**Trạng thái hiện tại**: 🔴 Khởi tạo (0% hoàn thành)

---

## 🎯 Milestone Overview

| Phase       | Mô tả                            | Timeline | Status         | Progress |
| ----------- | -------------------------------- | -------- | -------------- | -------- |
| **Phase 1** | Core Setup & Infrastructure      | Week 1   | 🔴 Not Started | 0%       |
| **Phase 2** | Authentication & User Management | Week 1-2 | 🔴 Not Started | 0%       |
| **Phase 3** | Manga Features (Core)            | Week 2-3 | 🔴 Not Started | 0%       |
| **Phase 4** | User Features & Interactions     | Week 3-4 | 🔴 Not Started | 0%       |
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

- [ ] 🔴 Atoms (shadcn/ui + custom)
  - [ ] Button
  - [ ] Input
  - [ ] Card
  - [ ] Badge
  - [ ] Avatar
  - [ ] Skeleton
  - [ ] Spinner
  - [ ] Dialog/Modal
  - [ ] Dropdown Menu
  - [ ] Toast
- [ ] 🔴 Layout Components
  - [ ] Header/Navbar
  - [ ] Footer
  - [ ] Sidebar (mobile)
  - [ ] Container/Wrapper
  - [ ] ErrorBoundary
- [ ] 🔴 Loading States
  - [ ] Page skeleton
  - [ ] Card skeleton
  - [ ] List skeleton

**Deliverables Phase 1:**

- ✅ Cấu trúc project hoàn chỉnh
- ✅ API client functional
- ✅ Base components library
- ✅ Type safety đầy đủ

**Timeline**: Days 1-4
**Progress**: 0/15 tasks (0%)

---

## 🔐 Phase 2: Authentication & User Management (Week 1-2)

**Mục tiêu**: Xây dựng hệ thống authentication an toàn và UX tốt

### 2.1 Authentication State Management

- [ ] 🔴 Setup Zustand auth store
  - [ ] User state
  - [ ] Token state
  - [ ] Login/Logout actions
  - [ ] Persist to localStorage
  - [ ] Auto-refresh token logic

### 2.2 Login Page

- [ ] 🔴 Create `/app/(auth)/login/page.tsx`
- [ ] 🔴 Login form với validation
  - [ ] Email validation (Zod)
  - [ ] Password validation
  - [ ] Error messages
  - [ ] Loading states
- [ ] 🔴 API integration
  - [ ] Call `POST /auth/login`
  - [ ] Store token
  - [ ] Redirect to homepage
- [ ] 🔴 Google OAuth button
  - [ ] Setup Google OAuth client
  - [ ] Handle OAuth flow
  - [ ] Call `POST /auth/google`

### 2.3 Register Page

- [ ] 🔴 Create `/app/(auth)/register/page.tsx`
- [ ] 🔴 Register form với validation
  - [ ] Name, Email, Password fields
  - [ ] Password confirmation
  - [ ] Terms & conditions checkbox
- [ ] 🔴 API integration
  - [ ] Call `POST /auth/register`
  - [ ] Auto-login after register
  - [ ] Welcome message

### 2.4 Protected Routes & Middleware

- [ ] 🔴 Create Next.js middleware
  - [ ] Check auth token
  - [ ] Redirect unauthenticated users
  - [ ] Public vs Private routes config
- [ ] 🔴 Auth HOC/wrapper components
  - [ ] `<ProtectedRoute>`
  - [ ] `<GuestOnly>`

### 2.5 User Context & Hooks

- [ ] 🔴 Custom hooks
  - [ ] `useAuth()` - Get auth state
  - [ ] `useUser()` - Get current user
  - [ ] `useLogin()` - Login mutation
  - [ ] `useLogout()` - Logout action
  - [ ] `useRegister()` - Register mutation

**Deliverables Phase 2:**

- ✅ Login/Register pages functional
- ✅ Google OAuth working
- ✅ Protected routes enforced
- ✅ Token refresh automatic

**Timeline**: Days 5-9
**Progress**: 0/13 tasks (0%)

---

## 📚 Phase 3: Manga Features (Core) (Week 2-3)

**Mục tiêu**: Xây dựng các tính năng chính của manga reader

### 3.1 Homepage

- [ ] 🔴 Create `/app/page.tsx`
- [ ] 🔴 Sections
  - [ ] Hero/Banner section
  - [ ] Recently Updated (API: `GET /mangas/recent`)
  - [ ] Hot/Trending (API: `GET /mangas/hot`)
  - [ ] Recommended for you (if logged in)
- [ ] 🔴 Components
  - [ ] `<MangaCard>` - Display manga item
  - [ ] `<MangaGrid>` - Grid layout
  - [ ] `<MangaCarousel>` - Horizontal scroll
  - [ ] `<GenreFilter>` - Filter by genre
  - [ ] `<SearchBar>` - Quick search
- [ ] 🔴 Pagination
  - [ ] Load more button
  - [ ] Infinite scroll (optional)
- [ ] 🔴 Loading & Error states

### 3.2 Manga Detail Page

- [ ] 🔴 Create `/app/manga/[slug]/page.tsx`
- [ ] 🔴 Fetch manga detail (API: `GET /mangas/{slug}`)
- [ ] 🔴 Display components
  - [ ] Cover image (optimized)
  - [ ] Title, Alt title, Pilot/Description
  - [ ] Genres badges
  - [ ] Artist/Author info
  - [ ] Translation group
  - [ ] Stats (views, rating, status)
- [ ] 🔴 Chapter list
  - [ ] Fetch chapters (API: `GET /mangas/{slug}/chapters`)
  - [ ] Sorting (asc/desc)
  - [ ] Pagination
  - [ ] Chapter card with date, views
- [ ] 🔴 Actions
  - [ ] Bookmark button (add to library)
  - [ ] Share button
  - [ ] Read First Chapter button
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

- [ ] 🔴 Create `/app/manga/[slug]/[chapter]/page.tsx`
- [ ] 🔴 Fetch chapter data (API: `GET /mangas/{slug}/chapters/{chapter}`)
- [ ] 🔴 Image display
  - [ ] Optimized image loading
  - [ ] Lazy loading
  - [ ] Progressive loading
- [ ] 🔴 Reading modes
  - [ ] Single page mode
  - [ ] Long strip mode (vertical scroll)
  - [ ] Switch between modes
- [ ] 🔴 Navigation controls
  - [ ] Previous chapter button
  - [ ] Next chapter button
  - [ ] Chapter dropdown selector
  - [ ] Back to manga detail
- [ ] 🔴 Reader controls
  - [ ] Zoom in/out
  - [ ] Fit to width/height
  - [ ] Fullscreen mode
- [ ] 🔴 Keyboard shortcuts
  - [ ] Arrow keys for navigation
  - [ ] ESC to exit fullscreen
  - [ ] Space for scroll/next page
- [ ] 🔴 Reading progress
  - [ ] Track current page
  - [ ] Mark chapter as viewed (API: `POST /chapters/{id}/view`)
  - [ ] Save reading position
- [ ] 🔴 Mobile gestures
  - [ ] Swipe for next/prev page
  - [ ] Pinch to zoom
  - [ ] Tap zones for navigation

### 3.4 Search & Filter Pages

- [ ] 🔴 Create `/app/search/page.tsx`
- [ ] 🔴 Search functionality
  - [ ] Search input with debounce
  - [ ] API: `GET /mangas/search?q={query}`
  - [ ] Search suggestions
  - [ ] Recent searches
- [ ] 🔴 Advanced filters
  - [ ] Genre multi-select
  - [ ] Status filter (ongoing/completed)
  - [ ] Sort options (views, rating, updated, name)
  - [ ] Filter UI (sidebar or drawer)
- [ ] 🔴 Results display
  - [ ] Grid/List view toggle
  - [ ] Pagination
  - [ ] Empty state
  - [ ] Loading skeleton

### 3.5 Genre Pages

- [ ] 🔴 Create `/app/genres/page.tsx` - All genres
- [ ] 🔴 Create `/app/genres/[slug]/page.tsx` - Genre detail
- [ ] 🔴 Fetch genre mangas
- [ ] 🔴 Genre color theming

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

### 4.1 User Profile

- [ ] 🔴 Create `/app/profile/page.tsx`
- [ ] 🔴 Display user info
  - [ ] Avatar, Name, Email
  - [ ] Join date
  - [ ] Points (total, used, available)
  - [ ] Achievements
- [ ] 🔴 Edit profile
  - [ ] Edit name
  - [ ] Change avatar (upload)
  - [ ] API: `PUT /user/profile`, `POST /user/avatar`
- [ ] 🔴 Account settings
  - [ ] Email preferences
  - [ ] Privacy settings
  - [ ] Change password

### 4.2 User Library

- [ ] 🔴 Create `/app/library/page.tsx`
- [ ] 🔴 Tabs/Sections
  - [ ] Continue Reading (from history)
  - [ ] Bookmarks/Favorites (API: `GET /user/bookmarks`)
  - [ ] Reading History (API: `GET /user/history`)
  - [ ] Completed
- [ ] 🔴 Bookmark management
  - [ ] Add bookmark (API: `POST /user/bookmarks`)
  - [ ] Remove bookmark (API: `DELETE /user/bookmarks/{id}`)
  - [ ] Sync across devices
- [ ] 🔴 Reading statistics
  - [ ] Total chapters read
  - [ ] Total time spent
  - [ ] Favorite genres
  - [ ] Reading streak

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

- ✅ User profile editable
- ✅ Library with history & bookmarks
- ✅ Comments & ratings working
- ✅ Notifications system

**Timeline**: Days 19-25
**Progress**: 0/24 tasks (0%)

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
- [ ] Multi-language support (i18n)
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

### Daily Log

#### 2025-10-31 (Day 1)

- ✅ Khởi tạo project với Next.js
- ✅ Đọc và phân tích API documentation
- ✅ Tạo CLAUDE.md với workflow
- ✅ Tạo ROADMAP.md
- 🟡 Next: Bắt đầu Phase 1 - Setup project structure

---

## 🎯 Current Focus

**Current Sprint**: Phase 1 - Core Setup
**Current Task**: Setup project structure
**Next Milestone**: Complete base UI components
**Blockers**: None

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

**Last Updated**: 2025-10-31
**Version**: 0.1.0
**Status**: 🔴 Development Started
