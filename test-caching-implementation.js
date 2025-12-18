/**
 * Manual Test Script for Phase 02 Caching and Prefetching Implementation
 *
 * This script provides step-by-step instructions for manually testing:
 * 1. Query key factory consistency
 * 2. Genre caching with 5min staleTime
 * 3. Manga list caching when switching filters
 * 4. Next page prefetch functionality
 * 5. Hover prefetch on manga cards
 * 6. Duplicate request prevention
 */

const testSteps = [
  {
    id: "query-key-consistency",
    title: "Test Query Key Factory Consistency",
    description: "Verify same keys on server and client",
    steps: [
      "1. Open browser DevTools (F12)",
      "2. Go to Console tab",
      "3. Navigate to http://localhost:3000/browse",
      "4. Check Network tab for initial requests:",
      "   - Should see /api/v1/mangas?...",
      "   - Should see /api/v1/genres?per_page=100",
      "5. Change filters (genre, status, sort)",
      "6. Check that query keys match pattern:",
      '   - ["manga", "list", {filters, page}]',
      '   - ["genres"] for genres',
      "7. Verify React Query DevTools shows same keys",
    ],
  },
  {
    id: "genre-caching",
    title: "Test Genre Caching (5min staleTime)",
    description:
      "Genres should be cached and not show loading after initial load",
    steps: [
      "1. Clear browser cache and reload",
      "2. Navigate to browse page",
      "3. Wait for genres to load (initial request)",
      "4. Navigate away to another page (e.g., home)",
      "5. Navigate back to browse page within 5 minutes",
      "6. Genre dropdown should NOT show loading state",
      "7. Network tab should show NO new request for genres",
      '8. In React Query DevTools, genres query should be "fresh"',
      "9. After 5 minutes, genres should refetch on navigate",
    ],
  },
  {
    id: "manga-list-caching",
    title: "Test Manga List Caching When Switching Filters",
    description:
      "Manga list should use cached data when returning to same filters",
    steps: [
      "1. Go to browse page",
      "2. Apply filters (e.g., Genre: Action, Status: Completed)",
      "3. Observe Network tab - see initial request",
      "4. Change to different filters",
      "5. Change back to original filters",
      "6. Should see INSTANT load from cache (no loading state)",
      '7. Network tab should show "stale-while-revalidate" or cached response',
      "8. React Query DevTools should show cached data being used",
    ],
  },
  {
    id: "next-page-prefetch",
    title: "Test Next Page Prefetch",
    description: "Next page should be prefetched when current page loads",
    steps: [
      "1. Go to browse page with pagination (page 1)",
      "2. Open Network tab with XHR/Fetch filter",
      "3. After page loads, wait 500ms (prefetch delay)",
      "4. Should see prefetch request for page 2:",
      "   - Same filters as page 1",
      "   - page=2 parameter",
      '5. Click "Next Page" button',
      "6. Page 2 should load INSTANTLY from cache",
      "7. No loading state should appear",
      "8. Network tab shows no new request (using prefetched data)",
    ],
  },
  {
    id: "hover-prefetch",
    title: "Test Hover Prefetch on Manga Cards",
    description: "Manga detail should be prefetched on hover",
    steps: [
      "1. Go to browse page",
      "2. Open Network tab",
      "3. Hover mouse over a manga card",
      "4. After 300ms (if exists), should see prefetch request:",
      "   - /api/v1/mangas/{slug}",
      "5. Click on the manga card",
      "6. Manga detail page should load INSTANTLY",
      '7. Should see "from cache" in Network timing',
      "8. Test with multiple cards quickly",
      "9. Only hovered cards should be prefetched",
    ],
  },
  {
    id: "no-duplicates",
    title: "Verify No Duplicate Requests",
    description: "Same data should not be requested multiple times",
    steps: [
      "1. Clear Network tab",
      "2. Rapidly switch between same filter combinations",
      "3. Each unique filter combination should only request once",
      "4. Check React Query DevTools:",
      "   - No duplicate queries with same keys",
      "   - Proper query deduplication",
      "5. Try these scenarios:",
      "   - Genre: All → Action → All → Action (should only 2 unique requests)",
      "   - Sort: Latest → Popular → Latest (should only 2 unique requests)",
    ],
  },
];

// Print test instructions
console.log("=".repeat(80));
console.log("PHASE 02 CACHING & PREFETCHING MANUAL TESTS");
console.log("=".repeat(80));
console.log();

testSteps.forEach((test, index) => {
  console.log(`${index + 1}. ${test.title}`);
  console.log(`   ${test.description}`);
  console.log("   Steps:");
  test.steps.forEach((step) => {
    console.log(`   ${step}`);
  });
  console.log();
});

console.log("=".repeat(80));
console.log("CHECKLIST:");
console.log("[ ] All query keys use centralized factory");
console.log("[ ] Genres cached for 5 minutes");
console.log("[ ] Manga list cached when switching filters");
console.log("[ ] Next page prefetched automatically");
console.log("[ ] Hover prefetch working on cards");
console.log("[ ] No duplicate requests for same data");
console.log("[ ] React Query DevTools shows proper cache behavior");
console.log("=".repeat(80));
