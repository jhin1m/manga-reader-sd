# Codebase Summary

## Project Overview

**Manga Reader CMS** is a modern manga reading platform built with **Next.js 16 (App Router)** and **Laravel API**. It focuses on performance, SEO, and internationalization (i18n), specifically targeting the Vietnamese market.

## Core Technology Stack

- **Framework**: Next.js 16.0.1 + React 19.2.0
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand + TanStack Query v5
- **Forms**: React Hook Form + Zod
- **i18n**: next-intl (Default: Vietnamese)
- **Notifications**: Sonner

## Key Features

- **Manga Browsing**: Advanced filtering and search for manga with SSR prefetching.
- **Reader Interface**: Optimized reading experience with single-page and long-strip modes.
- **User Library**: Personalized bookmarks and reading history.
- **Comment System**: Robust multi-level commenting for manga and chapters with emoji support.
- **SEO Optimized**: Centralized metadata management, canonical URLs, and structured data (JSON-LD).
- **i18n Support**: Full internationalization for all user-facing strings.

## Codebase Structure

- `/app`: Next.js App Router pages and layouts.
  - `(auth)`: Authentication routes.
  - `(manga)`: Manga detail, browsing, and reader pages.
  - `(user)`: User profile and library.
- `/components`: Reusable UI and feature-specific components.
  - `/manga`: Manga-specific UI components (cards, carousels, sections).
  - `/ui`: Base shadcn/ui components.
- `/lib`: Core logic and utilities.
  - `/api`: API clients and endpoints definitions.
  - `/seo`: SEO configuration and metadata generators.
  - `/store`: Zustand state management.
- `/docs`: Comprehensive project documentation.
- `/messages`: i18n translation files (JSON).
- `/types`: Global TypeScript interfaces and types.

## Implementation Details & Patterns

### 1. SEO & Accessibility

- **Centralized Metadata**: Managed in `lib/seo/`. Uses generator functions (`generateMangaMetadata`, etc.) to ensure consistency.
- **Canonical URLs**: Automatically generated for all main pages to prevent duplicate content issues.
- **Heading Hierarchy**: Every page includes a primary H1 (using `sr-only` if not visually required) for search engine indexing and screen readers.
- **Metadata Optimization**: Title and description lengths are strictly managed (e.g., manga titles truncated at 70 chars).

### 2. SSR & Data Fetching

- **SSR Prefetching**: Uses `HydrationBoundary` and `prefetchQuery` on the server to ensure fast initial page loads and content visibility for search bots.
- **Request-Scoped QueryClient**: Prevents cross-request data leakage on the server.
- **Parallel Fetching**: Multiple data sources are fetched concurrently during SSR to minimize Time to Interactive (TTI).

### 3. Internationalization (i18n)

- **Zero Hardcoding**: All user-facing text is managed in `messages/vi.json` and `messages/en.json`.
- **Namespace Pattern**: Translations are organized by feature area (e.g., `homepage`, `manga.detail`, `auth`).

### 4. Performance Optimization

- **Image Priority**: Critical above-the-fold images (like carousel items) use the `priority` attribute.
- **Caching Strategy**: 5-minute stale time for library data; 30-second stale time for frequently updated manga lists.
- **Optimistic Updates**: Used in the comment system for immediate UI feedback.

## Current Project Status

- **Core Infrastructure**: Complete ✅
- **Auth & Profile**: Complete ✅
- **Manga Reading & Browsing**: Complete ✅
- **User Library**: Complete ✅
- **Comment System**: Complete ✅
- **SSR Optimization**: Complete ✅
- **SEO Refinement**: Complete ✅

---

**Last Updated**: 2025-12-20
