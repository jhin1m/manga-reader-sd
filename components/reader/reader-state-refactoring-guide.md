# Reader State Refactoring Guide

This document outlines how to refactor `reader-view.tsx` to use `useReducer` for better performance and maintainability.

## Current State Issues

The component currently has 6+ separate `useState` hooks:
```typescript
const [readingMode, setReadingMode] = useState<"single" | "long-strip">("long-strip");
const [zoom, setZoom] = useState(100);
const [showControls, setShowControls] = useState(true);
const [currentPage, setCurrentPage] = useState(0);
const [backgroundColor, setBackgroundColor] = useState("#000000");
const [imageSpacing, setImageSpacing] = useState(0);
```

This causes unnecessary re-renders when any single state changes.

## Refactoring Steps

### 1. Update Imports
```typescript
import { useReducer } from "react";
import { readerReducer, initialState, type ReaderState } from "./reader-state-reducer";
import { readerActions } from "./reader-state-actions";
```

### 2. Replace State Declaration
```typescript
// Replace all useState calls with:
const [state, dispatch] = useReducer(readerReducer, initialState);
```

### 3. Update State References
Replace all state variable references:
- `readingMode` → `state.readingMode`
- `zoom` → `state.zoom`
- `showControls` → `state.showControls`
- `currentPage` → `state.currentPage`
- `backgroundColor` → `state.backgroundColor`
- `imageSpacing` → `state.imageSpacing`

### 4. Update State Setters
Replace all setter functions with dispatch calls:
```typescript
// Old
setReadingMode("single");
setZoom(150);
setShowControls(false);
setCurrentPage(5);
setBackgroundColor("#FFFFFF");
setImageSpacing(10);

// New
dispatch(readerActions.setSingleMode());
dispatch(readerActions.setZoom(150));
dispatch(readerActions.hideControls());
dispatch(readerActions.setPage(5));
dispatch(readerActions.setWhiteBackground());
dispatch(readerActions.setImageSpacing(10));
```

### 5. Update Callbacks
Memoize callbacks that depend on state:
```typescript
const handleNavigateChapter = useCallback(
  (slug: string) => {
    router.push(`/manga/${mangaSlug}/${slug}`);
  },
  [router, mangaSlug]
);

const handleNextPage = useCallback(() => {
  if (chapter?.content) {
    dispatch(readerActions.nextPage(chapter.content.length));
  }
}, [chapter?.content]);

const handlePreviousPage = useCallback(() => {
  dispatch(readerActions.previousPage());
}, []);
```

### 6. Update ReaderControls Props
Pass the consolidated state and dispatch:
```typescript
<ReaderControls
  mangaSlug={mangaSlug}
  currentChapterSlug={chapterSlug}
  chapterList={chapterList?.data}
  navigation={navigation}
  readingMode={state.readingMode}
  onReadingModeChange={(mode) => dispatch(readerActions.setReadingMode(mode))}
  zoom={state.zoom}
  onZoomChange={(zoom) => dispatch(readerActions.setZoom(zoom))}
  backgroundColor={state.backgroundColor}
  onBackgroundColorChange={(color) => dispatch(readerActions.setBackgroundColor(color))}
  imageSpacing={state.imageSpacing}
  onImageSpacingChange={(spacing) => dispatch(readerActions.setImageSpacing(spacing))}
  showControls={state.showControls}
  onShowControlsChange={(show) => dispatch(readerActions.setControls(show))}
  onNavigateChapter={handleNavigateChapter}
/>
```

## Benefits

1. **Reduced Re-renders**: Only one state update instead of multiple
2. **Better State Coherence**: Related state changes can be batched
3. **Easier Testing**: State logic is separate from UI
4. **Type Safety**: Centralized state with type-safe actions
5. **Debugging**: Easier to trace state changes with reducer pattern

## When to Apply

- **High Priority**: If React DevTools shows excessive re-renders
- **Medium Priority**: For better code organization and maintainability
- **Low Priority**: If current performance is acceptable

## Rollback Plan

Keep the original file as `.backup` before refactoring. If issues arise:
1. Restore from backup
2. Apply changes incrementally
3. Test after each state conversion