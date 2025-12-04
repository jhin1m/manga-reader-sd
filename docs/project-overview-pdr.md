# Project Overview & Product Development Requirements (PDR)

## Project Identity

**Project Name**: Manga Reader CMS

**Version**: 0.1.0 (Development)

**Status**: Active Development (Phase 2 Complete, Phase 3 Complete)

**Repository**: manga-reader-sd

**Development Start**: October 31, 2024

---

## Executive Summary

Manga Reader CMS is a modern, full-stack web application for reading manga online. Built with Next.js 16 and React 19, it provides a seamless manga reading experience with features like user authentication, bookmarking, reading history, and social interactions (comments and ratings). The platform integrates with a Laravel-based backend API and emphasizes performance, SEO optimization, and internationalization.

---

## Project Description

### Purpose

To create a comprehensive manga reading platform that offers:

- Fast, responsive manga reading experience across all devices
- User account management with authentication (email/password and Google OAuth)
- Personalized features (bookmarks, reading history, user library)
- Community features (comments, ratings)
- Multi-language support (currently Vietnamese with i18n infrastructure for expansion)
- SEO-optimized pages for better discoverability

### Target Users

1. **Manga Readers**: Primary users who want to read manga online for free
   - Age range: 13-35 years old
   - Tech-savvy, mobile-first users
   - Prefer ad-free or minimal ad experience

2. **Manga Enthusiasts**: Power users who:
   - Track multiple manga series
   - Engage with community through comments
   - Want reading statistics and progress tracking

3. **Mobile Users**: Users reading primarily on smartphones
   - Need optimized mobile interface
   - Require touch gestures for navigation
   - Expect fast loading times

### Value Proposition

**For Readers**:

- Clean, distraction-free reading experience
- No intrusive ads
- Fast page loads and image optimization
- Responsive design for all devices
- Personalized reading history and bookmarks

**For Content Discovery**:

- Categorization by genres
- Hot/trending manga recommendations
- Search and filter capabilities
- Recently updated manga section

**For Community**:

- Ability to rate and comment on manga
- Social interactions with other readers
- Bookmark and library management

---

## Technical Overview

### Tech Stack

#### Frontend

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0 (React Server Components)
- **TypeScript**: 5+
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React (0.552.0)
- **Package Manager**: pnpm 10.17.1

#### State Management

- **Global State**: Zustand 5.0.8 with localStorage persistence
- **Server State**: TanStack Query (React Query) 5.90.5
- **Forms**: React Hook Form 7.65.0 + Zod 4.1.12 validation

#### Backend Integration

- **API**: Laravel RESTful API (v1)
- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: Laravel Sanctum (Bearer tokens)
- **HTTP Client**: Custom Fetch wrapper with retry logic

#### Developer Tools

- **Linting**: ESLint 9 + Prettier 3.6.2
- **Git Hooks**: Husky 9.1.7 + lint-staged
- **Type Checking**: TypeScript compiler

#### Key Features

- **i18n**: next-intl 4.4.0 (default: Vietnamese)
- **SEO**: Centralized metadata management with JSON-LD schemas
- **Notifications**: Sonner 2.0.7 for toast notifications
- **OAuth**: Google OAuth via @react-oauth/google 0.12.2
- **Theming**: next-themes 0.4.6 for dark/light mode support

---

## Product Development Requirements (PDR)

### Functional Requirements

#### 1. User Authentication (Phase 2 - ✅ Completed)

**FR-AUTH-001: User Registration**

- Users can register with email and password
- Password must be at least 6 characters
- Password confirmation required
- Validation errors displayed in real-time
- Auto-login after successful registration
- Welcome message shown

**FR-AUTH-002: User Login**

- Users can login with email and password
- "Remember me" functionality via persisted Zustand store
- Error messages for invalid credentials
- Redirect to homepage after successful login

**FR-AUTH-003: Google OAuth**

- Users can authenticate via Google OAuth
- One-click Google sign-in button
- Automatic account creation for new Google users
- Token stored in Zustand + localStorage

**FR-AUTH-004: Session Management**

- Bearer token authentication
- Token stored securely in localStorage
- Token included in all authenticated API requests
- Auto-logout on 401 responses
- Token refresh capability (infrastructure ready)

**FR-AUTH-005: Protected Routes**

- Client-side route protection via wrapper components
- Unauthenticated users redirected to login
- Authenticated users cannot access login/register pages
- Guest-only routes for auth pages

#### 2. Manga Browsing (Phase 3 - 🟡 In Progress)

**FR-MANGA-001: Homepage**

- Display featured/hot manga carousel (✅ Implemented)
- Show recently updated manga section (✅ Implemented)
- Display hot manga sidebar (✅ Implemented)
- Responsive grid layout with loading skeletons (✅ Implemented)

**FR-MANGA-002: Manga List Display**

- Grid view with manga cards (✅ Implemented)
- Display cover image, title, status, views (✅ Implemented)
- Show latest chapter information (✅ Implemented)
- Genre badges (✅ Implemented)
- Loading skeletons during fetch (✅ Implemented)

**FR-MANGA-003: Manga Detail Page** (⏳ Next Priority)

- Display full manga information
- Show all chapters with sorting options
- Display cover, title, alt title, description
- Show genres, artist, author, translation group
- Display statistics (views, ratings)
- Bookmark button
- "Read First Chapter" / "Continue Reading" buttons
- Comments section
- Rating system

**FR-MANGA-004: Chapter Reader** (⏳ Planned)

- Display chapter images in order
- Previous/Next chapter navigation
- Chapter dropdown selector
- Reading mode toggle (single page / long strip)
- Zoom controls
- Fullscreen mode
- Keyboard shortcuts
- Mobile swipe gestures
- Track reading progress
- Mark chapter as viewed

**FR-MANGA-005: Search & Filter** (⏳ Planned)

- Text search with debounce
- Filter by genre (multi-select)
- Filter by status (ongoing/completed)
- Sort options (views, rating, updated, name)
- Pagination support
- Empty state handling

#### 3. User Library (Phase 4 - 🔴 Planned)

**FR-LIBRARY-001: Bookmarks**

- Add manga to bookmarks
- Remove from bookmarks
- View all bookmarked manga
- Bookmark sync across devices

**FR-LIBRARY-002: Reading History**

- Auto-track read chapters
- Display reading history
- "Continue Reading" functionality
- History persistence

**FR-LIBRARY-003: User Profile**

- View user information
- Edit profile (name)
- Change avatar (upload)
- View points and achievements
- Display reading statistics

#### 4. Social Features (Phase 4 - 🔴 Planned)

**FR-SOCIAL-001: Comments**

- Add comments to manga
- Reply to comments
- Like comments
- Report inappropriate comments
- Pagination for comment list

**FR-SOCIAL-002: Ratings**

- Rate manga (1-5 stars)
- Update existing rating
- Display average rating
- Show total rating count

### Non-Functional Requirements

#### NFR-PERF-001: Performance

- **Target**: First Contentful Paint (FCP) < 1.5s
- **Target**: Largest Contentful Paint (LCP) < 2.5s
- **Target**: Time to Interactive (TTI) < 3.5s
- Image optimization via Next.js Image component
- Code splitting via dynamic imports
- React Query caching with 5-minute stale time
- Retry logic with exponential backoff for API calls

#### NFR-PERF-002: Scalability

- API request retry with configurable max attempts
- Efficient state management (selective re-renders)
- Lazy loading for images and components
- Pagination for large data sets

#### NFR-SECURITY-001: Authentication Security

- Bearer token authentication
- Token stored in localStorage (accessible only to same origin)
- Auto-logout on token expiration (401 response)
- HTTPS enforcement (production)
- CORS configured for specific domains

#### NFR-SECURITY-002: Input Validation

- Client-side validation via Zod schemas
- XSS prevention via React's built-in escaping
- Form validation before API submission

#### NFR-USABILITY-001: Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements (min 44x44px tap targets)
- Responsive images with appropriate sizes

#### NFR-USABILITY-002: Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management for modals and dialogs
- Color contrast compliance (WCAG AA)

#### NFR-SEO-001: Search Engine Optimization

- Dynamic meta tags for all pages
- Open Graph tags for social sharing
- JSON-LD structured data (WebSite, Breadcrumb, Book schemas)
- Centralized SEO configuration
- Sitemap generation (planned)
- Robots.txt configuration

#### NFR-I18N-001: Internationalization

- Full i18n support via next-intl
- Default locale: Vietnamese (vi)
- All user-facing text via translation keys
- No hardcoded strings in components
- Date/number formatting per locale
- Infrastructure ready for additional locales (en, ja, etc.)

#### NFR-DX-001: Developer Experience

- TypeScript for type safety
- Centralized API client with error handling
- Reusable component library
- Consistent code formatting (Prettier)
- Git hooks for pre-commit validation
- Comprehensive JSDoc comments

#### NFR-MAINT-001: Maintainability

- Modular code organization
- Clear separation of concerns (API, UI, state)
- Consistent naming conventions
- Documented architectural decisions
- Single responsibility principle for components

---

## Architecture Principles

### 1. Separation of Concerns

- **UI Layer**: Components focused on presentation
- **State Layer**: Zustand for global state, React Query for server state
- **API Layer**: Centralized API client and endpoint modules
- **Validation Layer**: Zod schemas separate from components

### 2. Server vs Client Components

- Server Components by default (better performance)
- Client Components only when necessary (interactivity, hooks)
- Clear separation with wrapper pattern

### 3. Type Safety

- Strict TypeScript configuration
- No `any` types
- API response types defined upfront
- Type inference for better DX

### 4. Progressive Enhancement

- Works without JavaScript (where possible)
- Graceful degradation for older browsers
- Loading states for all async operations
- Error boundaries for fault tolerance

### 5. Performance First

- Image optimization mandatory
- Lazy loading for below-fold content
- Code splitting at route level
- Efficient re-rendering via React Query

---

## Success Metrics

### User Engagement

- **Target**: 70% of users return within 7 days
- **Metric**: Average session duration > 10 minutes
- **Metric**: Average pages per session > 5

### Performance

- **Target**: Lighthouse Performance score > 90
- **Target**: Core Web Vitals: All "Good"
- **Metric**: Average page load time < 2 seconds
- **Metric**: API response time P95 < 500ms

### Content Consumption

- **Target**: 80% of visitors view at least one chapter
- **Metric**: Average chapters read per user per session > 3
- **Metric**: Bookmark rate > 15% of authenticated users

### Technical Quality

- **Target**: 95% uptime
- **Target**: Error rate < 1% of requests
- **Metric**: Zero critical security vulnerabilities
- **Metric**: Test coverage > 70% (when testing implemented)

### SEO

- **Target**: Top 10 ranking for "đọc manga online"
- **Metric**: Organic search traffic > 50% of total
- **Metric**: Average time on page > 5 minutes

---

## Development Phases

### Phase 1: Core Setup & Infrastructure (✅ Completed)

- Project structure setup
- API client infrastructure
- Base UI components
- SEO & i18n infrastructure
- **Status**: 100% complete (17/17 tasks)
- **Duration**: Days 1-4

### Phase 2: Authentication & User Management (✅ Completed)

- Auth state management (Zustand)
- Login/Register pages
- Google OAuth integration
- Protected routes
- Custom auth hooks
- **Status**: 100% complete (10/10 tasks)
- **Duration**: Days 5-9

### Phase 3: Custom Hooks for User Profile (✅ Completed)

- Profile management hooks (`lib/hooks/use-profile.ts`)
  - `useUpdateProfile()` - Update user name and email
  - `useUploadAvatar()` - Handle avatar file uploads
  - `useUpdatePassword()` - Change user password
- Features:
  - All hooks validate with Phase 2 Zod schemas
  - Return standardized `{ success, data?, error? }` pattern
  - Profile/avatar hooks sync with Zustand auth store
  - Error messages use i18n keys, not raw API errors
  - Built-in loading states
- Updated translation keys (`messages/vi.json`)
- **Status**: 100% complete
- **Duration**: Day 10

### Phase 4: Manga Features (Core) (🟡 In Progress)

- Homepage (✅ Completed)
- Manga detail page (⏳ Next)
- Chapter reader (✅ Completed)
- Search & filter (⏳ Planned)
- Genre pages (⏳ Planned)
- **Status**: ~50% complete (17/34 tasks)
- **Target**: Days 11-18

### Phase 5: User Features & Interactions (🔴 Planned)

- User profile management UI (Phase 4 hooks ready)
- Library (bookmarks, history)
- Comments system
- Rating system
- Notifications
- **Target**: Days 19-25

### Phase 6: Polish & Optimization (🔴 Planned)

- Performance optimization
- SEO completion
- Mobile responsiveness
- Accessibility (a11y)
- Testing
- Documentation
- Deployment
- **Target**: Days 26-30

---

## Technical Constraints

### Hard Constraints

1. **Backend API**: Must integrate with existing Laravel API at `http://localhost:8000/api/v1`
2. **Authentication**: Laravel Sanctum with Bearer tokens (no session-based auth)
3. **Browser Support**: Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
4. **Node Version**: Node.js 20+ required for Next.js 16

### Soft Constraints

1. **Bundle Size**: Target < 300KB initial JS bundle (gzipped)
2. **Image Formats**: Prefer WebP with JPEG fallback
3. **API Rate Limiting**: Respect 60 requests/minute for unauthenticated users
4. **Mobile**: Optimize for iOS Safari and Chrome Android

---

## Dependencies & Integrations

### External Services

1. **Google OAuth**: Authentication provider
2. **Backend API**: Laravel manga database and business logic

### Third-Party Libraries

- **UI**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Noto Sans via next/font for optimized font loading

---

## Risk Assessment

### Technical Risks

**RISK-TECH-001: API Performance**

- **Description**: Laravel API may be slow or unreliable
- **Mitigation**: Implement retry logic, caching, and loading states
- **Severity**: Medium

**RISK-TECH-002: Image Loading**

- **Description**: Large manga images may cause slow loading
- **Mitigation**: Next.js Image optimization, lazy loading, progressive loading
- **Severity**: High

**RISK-TECH-003: Mobile Performance**

- **Description**: Poor performance on low-end devices
- **Mitigation**: Code splitting, lazy loading, performance monitoring
- **Severity**: Medium

### Product Risks

**RISK-PROD-001: User Retention**

- **Description**: Users may not return after first visit
- **Mitigation**: Implement bookmarks, reading history, notifications
- **Severity**: High

**RISK-PROD-002: Content Discovery**

- **Description**: Users may struggle to find manga they like
- **Mitigation**: Good search, filters, recommendations
- **Severity**: Medium

---

## Future Enhancements (Beyond MVP)

### Priority: Medium

- Dark/Light theme toggle (infrastructure exists via next-themes)
- Additional language support (English, Japanese)
- Download chapters for offline reading
- Custom reading lists
- Follow authors/artists
- Recommendation algorithm
- Social features (follow users, activity feed)

### Priority: Low

- Forums/Discussion boards
- Advanced reader (filters, brightness control)
- Custom themes/skins
- Keyboard shortcuts customization
- Reading stats dashboard
- Achievements system
- Leaderboards
- Admin panel

---

## References

### Documentation

- [API Documentation](/Users/jhin1m/Desktop/ducanh-project/manga-reader-sd/docs/API_DOCUMENTATION.md)
- [Development Roadmap](/Users/jhin1m/Desktop/ducanh-project/manga-reader-sd/docs/ROADMAP.md)
- [Development Guidelines](/Users/jhin1m/Desktop/ducanh-project/manga-reader-sd/CLAUDE.md)

### Key Technologies

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [shadcn/ui](https://ui.shadcn.com)
- [next-intl](https://next-intl-docs.vercel.app/)

---

**Document Version**: 1.0
**Last Updated**: 2025-01-07
**Next Review**: Phase 3 completion
**Owner**: Development Team
