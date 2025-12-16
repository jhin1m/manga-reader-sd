# Performance Testing Guide for Reader Component

This guide explains how to test and verify performance improvements after refactoring the reader component.

## Tools Needed

1. **React DevTools Profiler** - Chrome extension
2. **Chrome DevTools Performance Tab**
3. **Chrome DevTools Memory Tab**

## Before Refactoring (Baseline)

### 1. React DevTools Profiler Test

1. Open Chrome DevTools → Components tab
2. Enable "Highlight updates when components render"
3. Open a manga chapter page
4. Perform these actions and observe re-renders:
   - Change reading mode (single ↔ long-strip)
   - Adjust zoom level
   - Toggle controls visibility
   - Navigate to next/previous page

**Expected to see**: Multiple components re-rendering for each action

### 2. Performance Profile Test

1. Open Chrome DevTools → Performance tab
2. Record a profile while:
   - Loading a chapter page
   - Changing settings 5-10 times
   - Navigating between pages
3. Analyze the "Main" thread for JavaScript execution time

### 3. Memory Test

1. Open Chrome DevTools → Memory tab
2. Take a heap snapshot
3. Navigate through 10+ chapters, changing settings
4. Take another snapshot
5. Compare for detached DOM nodes and memory growth

## After Refactoring (With useReducer)

Repeat the same tests above. You should see:

### Expected Improvements

1. **Fewer Re-renders**: Only components that depend on changed state re-render
2. **Reduced JavaScript Time**: Fewer state updates = less computation
3. **Stable Memory Usage**: No memory leaks from event listeners

### Specific Metrics to Check

1. **In the Profiler**:
   - Count of rendered components per action should decrease
   - Total render time should be lower
   - No unnecessary re-renders

2. **In Performance Tab**:
   - Script execution time reduced
   - Less time spent in React reconciliation
   - Smoother interaction response

3. **In Memory Tab**:
   - No increase in detached DOM nodes
   - Stable heap size over time
   - No memory leaks

## Automated Performance Testing

For CI/CD, consider adding:

### Lighthouse CI Integration
```yaml
# .github/workflows/performance.yml
name: Performance Test
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse
        run: |
          npm install
          npm run build
          npm run start &
          sleep 10
          npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-results.json
```

### Custom Performance Metrics
```javascript
// utils/performance-observer.js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'measure') {
      console.log(`${entry.name}: ${entry.duration}ms`);
    }
  }
});

observer.observe({ entryTypes: ['measure'] });

// Usage in components:
performance.mark('state-update-start');
// ... state update logic
performance.mark('state-update-end');
performance.measure('state-update', 'state-update-start', 'state-update-end');
```

## Code Quality Checklist

After refactoring, verify:

- [ ] All state updates go through dispatch
- [ ] No direct state mutations
- [ ] Callbacks properly memoized with useCallback
- [ ] Complex computations memoized with useMemo
- [ ] No missing dependencies in useEffect/ useCallback
- [ ] Event listeners have cleanup functions

## Performance Budget

Set these targets:

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Memory usage growth**: < 10MB after 100 interactions

## Reporting Results

Document findings in:
1. Performance metrics before/after
2. Screenshots of DevTools profiling
3. Lighthouse scores
4. User interaction timing measurements

This creates a baseline for future optimizations and proves the value of refactoring efforts.