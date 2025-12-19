# Comment Section Refinement (Phases 02 & 03): Unified Discussion & Badge Update

**Date**: 2025-12-19
**Status**: Completed

## Summary

Refined the comment system to provide a more unified discussion experience. The manga detail page now displays all comments (manga + chapters), and the chapter reader features a simplified 2-tab interface. Badge logic was simplified to improve readability and context.

## Changes

### 1. Unified Discussion (Phase 02)

#### Manga Detail Page (`app/(manga)/manga/[slug]/manga-detail-content.tsx`)

- Changed `useMangaComments` fetch type from `"manga"` to `"all"`.
- Users can now see and engage with all discussions related to the series in one place.

#### Chapter Reader (`components/comments/chapter-reader-comments.tsx`)

- Reduced tabs from 3 to 2:
  - **Chapter Comments**: Discussions specific to the current chapter.
  - **All Comments**: Unified feed of all comments for the manga series.
- Removed the separate "Manga Comments" tab for a cleaner interface.

### 2. Badge Logic Update (Phase 03)

#### Type Definitions (`types/comment.ts`)

- Added `ChapterInfo` interface for chapter metadata.
- Updated `Comment` interface with optional `chapter_info`.

#### UI Refinement (`components/comments/comment-item.tsx`)

- Replaced the generic `CommentBadge` with inline chapter information.
- Chapter-level comments display the full chapter name (e.g., "Chapter 1095").
- Manga-level comments show no badge, providing a cleaner look.
- Simplified rendering logic by removing unused `CommentBadge` component.

#### Tab Refinement (`comment-tabs.tsx`)

- Removed badge/type logic from tabs for better consistency.

### 3. Testing

- Updated `comment-tabs.test.tsx` to reflect the removal of badge logic in tabs.

## Technical Notes

- `ChapterInfo` is automatically populated by the API when fetching comments in a manga context (`type=all`).
- The unified view improves user engagement by aggregating discussions from various chapters into the main manga page.
