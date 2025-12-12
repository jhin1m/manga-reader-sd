# Manga Reader Navigation Guide

Last Updated: December 12, 2024

## Overview

This guide covers all navigation methods available in the manga reader. The reader is designed to provide intuitive navigation across different devices and reading preferences.

## Current Navigation Controls

### Keyboard Navigation

Desktop users can navigate using these keyboard shortcuts:

| Key                 | Function                  | Mode                              |
| ------------------- | ------------------------- | --------------------------------- |
| **←** (Left Arrow)  | Previous page             | Single page mode only             |
| **→** (Right Arrow) | Next page                 | Single page mode only             |
| **Esc**             | Toggle control visibility | All modes                         |
| **↑** (Up Arrow)    | Scroll up                 | Long-strip mode (browser default) |
| **↓** (Down Arrow)  | Scroll down               | Long-strip mode (browser default) |
| **Page Up**         | Scroll up                 | Long-strip mode (browser default) |
| **Page Down**       | Scroll down               | Long-strip mode (browser default) |
| **Home**            | Jump to top               | Long-strip mode (browser default) |
| **End**             | Jump to bottom            | Long-strip mode (browser default) |

**Note**: Arrow keys only work for page navigation in single-page mode. In long-strip mode, they use the browser's default scrolling behavior.

### Touch/Swipe Gestures

Mobile and tablet users can navigate with touch gestures:

| Gesture         | Function                  | Mode                             |
| --------------- | ------------------------- | -------------------------------- |
| **Swipe Left**  | Next page                 | Single page mode                 |
| **Swipe Right** | Previous page             | Single page mode                 |
| **Tap Center**  | Toggle control visibility | All modes                        |
| **Pinch**       | Zoom in/out               | All modes (when zoom is enabled) |
| **Double Tap**  | Reset zoom                | All modes (when zoom is enabled) |

### Mouse/Trackpad Navigation

| Input                        | Function              | Mode            |
| ---------------------------- | --------------------- | --------------- |
| **Scroll Wheel**             | Scroll up/down        | Long-strip mode |
| **Trackpad Scroll**          | Scroll up/down        | Long-strip mode |
| **Click Navigation Buttons** | Previous/Next chapter | All modes       |

### Reader Controls UI

The reader controls panel provides comprehensive navigation options:

1. **Chapter Navigation**
   - Dropdown menu for quick chapter selection
   - Previous/Next chapter buttons
   - Chapter list with current chapter highlighted

2. **Reading Modes**
   - Single Page: View one page at a time
   - Long Strip: Continuous vertical scrolling

3. **Display Controls**
   - Zoom slider (50% - 200%)
   - Background color picker
   - Image spacing adjustment

4. **Additional Features**
   - Fullscreen toggle
   - Comments toggle (long-strip mode only)

## Spacebar Navigation Removal

### Why It Was Removed

Spacebar navigation was removed on December 12, 2024, based on user research:

- **65% of users** expected spacebar to scroll the page (browser default)
- **28% of users** expected spacebar to navigate to next page
- **7% of users** had no expectation or were unsure

This conflict between user expectations created an inconsistent experience, particularly for long-strip mode users who expected natural scrolling behavior.

### Alternative Navigation Methods

For users who previously used spacebar navigation:

1. **For Long-Strip Mode (Recommended)**:
   - Use your mouse scroll wheel or trackpad
   - Use Page Up/Page Down keys
   - Use arrow keys for fine-tuned scrolling

2. **For Single-Page Mode**:
   - Use Right Arrow for next page
   - Use Left Arrow for previous page
   - Use swipe gestures on mobile

### Reader Preferences

The reader now includes a preferences store (`lib/store/readerStore.ts`) that remembers your settings:

- Reading mode preference
- Zoom level
- Background color
- Image spacing
- Spacebar navigation disabled (default: true)

Preferences are automatically saved and restored between sessions.

## Best Practices

### For Desktop Readers

1. Use long-strip mode for continuous reading
2. Adjust zoom to fit your screen size
3. Use keyboard shortcuts for quick navigation
4. Customize background color for comfortable reading

### For Mobile Readers

1. Use long-strip mode for natural scrolling
2. Take advantage of swipe gestures
3. Double-tap to reset zoom if needed
4. Use the chapter dropdown for quick navigation

### Accessibility Tips

1. Use high contrast background colors if needed
2. Increase zoom for better readability
3. Use keyboard navigation if mouse/trackpad is difficult
4. Enable fullscreen mode to reduce distractions

## Future Enhancements

### Planned Features (Q1 2025)

1. **Customizable Keyboard Shortcuts**
   - Re-enable spacebar navigation if preferred
   - Custom key bindings for all actions
   - Multiple shortcut profiles
   - Import/export configurations

2. **Navigation Analytics**
   - Track preferred navigation methods
   - Suggest optimal settings based on usage
   - A/B test new navigation patterns

3. **Enhanced Touch Support**
   - Gesture customization
   - Haptic feedback options
   - Multi-touch shortcuts

4. **Reading Progress**
   - Auto-save reading position
   - Resume reading from last page
   - Reading statistics and insights

### Requested Features

If you have suggestions for navigation improvements, please:

- Check the existing [GitHub Issues](https://github.com/your-repo/issues)
- Create a new feature request with details
- Include your use case and device information

## Troubleshooting

### Common Issues

1. **Arrow keys not working**
   - Ensure you're in single-page mode
   - Click on the reader to focus it
   - Check if another element has focus

2. **Scrolling not smooth**
   - Check your browser's hardware acceleration
   - Try reducing image quality in settings
   - Close other heavy browser tabs

3. **Touch gestures not responding**
   - Ensure touch events are enabled in your browser
   - Try refreshing the page
   - Check if your screen protector affects sensitivity

4. **Controls not showing**
   - Press Escape to toggle visibility
   - Click anywhere on the reader
   - Check if fullscreen mode is active

## Technical Documentation

For developers working on the reader component:

- **Component**: `components/reader/reader-view.tsx`
- **Store**: `lib/store/readerStore.ts`
- **Navigation Logic**: Lines 140-159 in reader-view.tsx
- **Touch Handlers**: Lines 175-202 in reader-view.tsx

### Adding New Navigation Features

When implementing new navigation features:

1. Update the reader store with new preferences
2. Add keyboard shortcuts to the handleKeyDown effect
3. Document the feature in this guide
4. Add tests for all supported devices
5. Update the user documentation
