# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Chapter List Pagination & UX Enhancements (Phases 01-05):
  - Server-side pagination for chapter lists (50 items/page).
  - Skeleton loading states for chapter grid.
  - Smooth scroll animation to chapter section on page navigation.
  - Server-side sorting integration with pagination.
  - Refined total chapter count display from API metadata.
- Phase 01: SSR prefetch and streaming for manga browsing.
- Phase 02: Caching and prefetching for manga browsing.
- Phase 03: Image priority loading for manga browsing.

### Changed

- Refined comment section (Refinement Plan Phases 01-03):
  - Simplified badge logic: Only show chapter name badge for chapter comments.
  - Manga detail page now shows all comments (manga + chapter) by default.
  - Chapter reader reduced from 3 tabs to 2 tabs (Chapter Comments, All Comments).
- Improved comment badge UI with cleaner logic.

### Fixed

- Comment badge logic showing "CH"/"MG" prefix (removed for cleaner look).

## [0.1.0] - 2025-12-05

### Added

- Initial project structure and core infrastructure.
- Authentication & User Management (Login, Register, Google OAuth).
- Core Manga Features (Homepage, Detail Page, Chapter Reader).
- User Profile implementation.
- User Library (Favorites, History, Continue Reading).
- Comments System (Phases 01-04: API, Hooks, UI, Emoji integration).
- i18n support for Vietnamese and English.
- SEO and Metadata infrastructure.
