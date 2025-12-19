# Comment Section Refinement Phase 01: Badge Logic Update

**Date**: 2025-12-19
**Status**: Completed

## Summary

Simplified comment badge display logic. Removed generic "CH"/"MG" badges in favor of explicit chapter information for chapter-level comments.

## Changes

### 1. Type Definitions (`types/comment.ts`)

- Added `ChapterInfo` interface to represent chapter metadata
- Updated `Comment` interface to include optional `chapter_info` field

### 2. UI Refinement (`components/comments/`)

#### `comment-item.tsx`

- Replaced `CommentBadge` with inline chapter name logic
- Chapter comments now display the full chapter name (e.g., "Chapter 1095")
- Manga-level comments show no badge
- Cleaned up unused imports and simplified badge rendering

#### `comment-tabs.tsx` & `chapter-reader-comments.tsx`

- Removed `CommentBadge` usage from tabs
- Simplified tab properties by removing `type` and badge-related logic

### 3. Testing (`components/comments/__tests__/`)

- Updated `comment-tabs.test.tsx` to reflect the removal of badge logic in tabs

## Technical Notes

- `ChapterInfo` is automatically populated by the API when fetching comments in a manga context
- Inline display improves readability and provides better context for manga-level comment feeds
