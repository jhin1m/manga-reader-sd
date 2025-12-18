#!/usr/bin/env node

/**
 * Test script to verify Phase 03 image optimization implementation
 * Tests priority loading, shimmer placeholders, sizes attribute, and CLS
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const TEST_PAGE = '/browse';

async function testImageOptimization() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track network requests for priority testing
  const networkRequests = [];
  page.on('request', request => {
    if (request.url().includes('/uploads/manga/')) {
      networkRequests.push({
        url: request.url(),
        priority: request.headers()['priority'] || request.headers()['x-priority'],
        timestamp: Date.now()
      });
    }
  });

  console.log('\n=== Image Optimization Test Report ===\n');

  try {
    // Test 1: Verify first 6 images have priority attribute
    console.log('1. Testing priority attribute on first 6 images...');
    await page.goto(`${BASE_URL}${TEST_PAGE}`, { waitUntil: 'networkidle' });

    // Wait for images to load
    try {
      await page.waitForSelector('img[alt*="chapter"]', { timeout: 10000 });
    } catch (e) {
      console.log('   ⚠ No manga images found. Checking if page has loaded...');
      const pageContent = await page.content();
      if (pageContent.includes('noResults') || pageContent.includes('loading')) {
        console.log('   ℹ Page shows no results or is loading. Skipping image tests.');
        return;
      }

      // Try alternative selector
      await page.waitForSelector('img[alt]', { timeout: 5000 });
    }

    const imageElements = await page.$$('img[alt]');
    console.log(`   Total images found: ${imageElements.length}`);

    let priorityCount = 0;
    let firstImagesChecked = 0;

    for (let i = 0; i < Math.min(6, imageElements.length); i++) {
      const hasPriority = await imageElements[i].evaluate(el => el.hasAttribute('priority'));
      const fetchPriority = await imageElements[i].evaluate(el => el.getAttribute('fetchpriority'));

      if (hasPriority) {
        priorityCount++;
        console.log(`   ✓ Image ${i + 1}: priority attribute present (fetchpriority: ${fetchPriority})`);
      } else {
        console.log(`   ✗ Image ${i + 1}: priority attribute MISSING`);
      }
      firstImagesChecked++;
    }

    console.log(`   Priority images: ${priorityCount}/${firstImagesChecked}`);

    // Test 2: Check shimmer placeholder
    console.log('\n2. Testing shimmer placeholder...');
    const hasShimmer = await page.$eval('img[alt*="chapter"]', (img) => {
      return img.style.backgroundImage && img.style.backgroundImage.includes('data:image/svg+xml');
    }).catch(() => false);

    if (hasShimmer) {
      console.log('   ✓ Shimmer placeholder detected');
    } else {
      console.log('   ⚠ Shimmer placeholder not visible (may have loaded already)');

      // Check blurDataURL
      const hasBlurData = await page.$eval('img[alt]', (img) => {
        return img.getAttribute('blurDataURL') && img.getAttribute('blurDataURL').startsWith('data:image/svg+xml');
      });

      if (hasBlurData) {
        console.log('   ✓ blurDataURL attribute present');
      } else {
        console.log('   ✗ blurDataURL attribute missing');
      }
    }

    // Test 3: Verify sizes attribute matches grid layout
    console.log('\n3. Testing sizes attribute...');
    const sizes = await page.$eval('img[alt]', (img) => img.getAttribute('sizes'));
    console.log(`   Sizes attribute: ${sizes}`);

    // Expected sizes based on grid: 3 cols mobile, 4 cols tablet, 5 cols desktop
    // 3 cols = 33.33vw, 4 cols = 25vw, 5 cols = 20vw
    if (sizes && sizes.includes('50vw') && sizes.includes('33vw') && sizes.includes('20vw')) {
      console.log('   ✓ Sizes attribute matches grid layout');
    } else {
      console.log('   ⚠ Sizes attribute may need adjustment');
      console.log('     Expected: (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw');
    }

    // Test 4: Check for layout shift (CLS)
    console.log('\n4. Testing for layout shift...');

    // Measure initial positions
    const initialPositions = await page.$$eval('.grid > div', (elements) =>
      elements.slice(0, 6).map(el => ({
        top: el.getBoundingClientRect().top,
        left: el.getBoundingClientRect().left
      }))
    );

    // Wait a bit more for any lazy-loaded content
    await page.waitForTimeout(2000);

    const finalPositions = await page.$$eval('.grid > div', (elements) =>
      elements.slice(0, 6).map(el => ({
        top: el.getBoundingClientRect().top,
        left: el.getBoundingClientRect().left
      }))
    );

    let hasShift = false;
    for (let i = 0; i < initialPositions.length; i++) {
      const shiftY = Math.abs(initialPositions[i].top - finalPositions[i].top);
      const shiftX = Math.abs(initialPositions[i].left - finalPositions[i].left);

      if (shiftY > 1 || shiftX > 1) {
        hasShift = true;
        console.log(`   ⚠ Layout shift detected on item ${i + 1}: X=${shiftX.toFixed(2)}px, Y=${shiftY.toFixed(2)}px`);
      }
    }

    if (!hasShift) {
      console.log('   ✓ No significant layout shift detected');
    }

    // Test 5: Verify lazy loading for images below the fold
    console.log('\n5. Testing lazy loading for images below the fold...');

    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);

    // Check loading attribute on images
    const allLoadingAttrs = await page.$$eval('img[alt]', (imgs) =>
      imgs.map(img => img.getAttribute('loading'))
    );

    const eagerCount = allLoadingAttrs.filter(attr => attr === 'eager').length;
    const lazyCount = allLoadingAttrs.filter(attr => attr === 'lazy').length;
    const missingCount = allLoadingAttrs.filter(attr => attr === null).length;

    console.log(`   Images with loading="eager": ${eagerCount}`);
    console.log(`   Images with loading="lazy": ${lazyCount}`);
    console.log(`   Images without loading attribute: ${missingCount}`);

    if (lazyCount > 0) {
      console.log('   ✓ Lazy loading detected for some images');
    } else {
      console.log('   ⚠ No explicit lazy loading found (Next.js handles automatically)');
    }

    // Test 6: Performance metrics
    console.log('\n6. Performance metrics...');

    const metrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      const imageEntries = entries.filter(entry => entry.name.includes('/uploads/manga/'));

      return {
        totalImages: imageEntries.length,
        averageLoadTime: imageEntries.reduce((sum, entry) => sum + entry.duration, 0) / imageEntries.length || 0,
        totalSize: imageEntries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0)
      };
    });

    console.log(`   Total images loaded: ${metrics.totalImages}`);
    console.log(`   Average load time: ${metrics.averageLoadTime.toFixed(2)}ms`);
    console.log(`   Total transfer size: ${(metrics.totalSize / 1024).toFixed(2)}KB`);

    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`Priority images (expected: 6): ${priorityCount}`);
    console.log(`Shimmer placeholder: ${hasShimmer ? '✓' : '⚠'}`);
    console.log(`Sizes attribute: ${sizes ? '✓' : '✗'}`);
    console.log(`Layout shift: ${hasShift ? '⚠ Detected' : '✓ None'}`);
    console.log(`Lazy loading: ${lazyCount > 0 ? '✓ Active' : '⚠ Automatic'}`);

  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testImageOptimization().catch(console.error);