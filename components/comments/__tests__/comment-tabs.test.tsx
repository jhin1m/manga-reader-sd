import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentTabs } from '../comment-tabs';

// Mock framer-motion to prevent animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string, params?: Record<string, unknown>) => {
    const translations = {
      comment: {
        tabs: {
          chapterComments: 'Chapter Comments',
          mangaComments: 'Manga Comments',
          allComments: 'All Comments',
        },
        activeTab: 'Currently viewing {tab} tab',
        swipeHint: 'Swipe left or right to switch tabs',
      },
    };

    // If we have a namespace, look in that namespace
    if (namespace && translations[namespace as keyof typeof translations]) {
      const value = translations[namespace as keyof typeof translations][key as keyof typeof translations.comment];
      return typeof value === 'function' ? value(params || {}) : value || `${namespace}.${key}`;
    }

    // Fallback for nested keys like "comment.tabs"
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }

    return typeof value === 'function' ? value(params || {}) : value || key;
  },
}));

// Mock CommentBadge
jest.mock('../comment-badge', () => ({
  CommentBadge: ({ type, className }: { type?: string; className?: string }) => (
    <span className={className} data-testid={`comment-badge-${type}`}>
      {type === 'chapter' ? 'CH' : 'MG'}
    </span>
  ),
}));

describe('CommentTabs', () => {
  const mockTabs = [
    {
      id: 'chapter',
      label: 'Chapter Comments',
      count: 25,
      type: 'chapter' as const,
      content: <div>Chapter content</div>,
    },
    {
      id: 'manga',
      label: 'Manga Comments',
      count: 142,
      type: 'manga' as const,
      content: <div>Manga content</div>,
    },
    {
      id: 'all',
      label: 'All Comments',
      count: 167,
      content: <div>All comments content</div>,
    },
  ];

  it('renders all tabs with correct labels and counts', () => {
    render(<CommentTabs tabs={mockTabs} />);

    expect(screen.getByText('Chapter Comments')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Manga Comments')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('All Comments')).toBeInTheDocument();
    expect(screen.getByText('167')).toBeInTheDocument();
  });

  it('shows badges for comment types', () => {
    render(<CommentTabs tabs={mockTabs} />);

    expect(screen.getByTestId('comment-badge-chapter')).toBeInTheDocument();
    expect(screen.getByTestId('comment-badge-manga')).toBeInTheDocument();
    expect(screen.getByText('CH')).toBeInTheDocument();
    expect(screen.getByText('MG')).toBeInTheDocument();
  });

  it('switches tabs when clicked', async () => {
    const user = userEvent.setup();
    render(<CommentTabs tabs={mockTabs} />);

    // Initially on chapter tab
    expect(screen.getByText('Chapter content')).toBeInTheDocument();
    expect(screen.queryByText('Manga content')).not.toBeInTheDocument();

    // Click manga tab
    await user.click(screen.getByText('Manga Comments'));

    // Should show manga content
    await waitFor(() => {
      expect(screen.getByText('Manga content')).toBeInTheDocument();
      expect(screen.queryByText('Chapter content')).not.toBeInTheDocument();
    });
  });

  it('calls onTabChange when tab switches', async () => {
    const onTabChange = jest.fn();
    const user = userEvent.setup();

    render(<CommentTabs tabs={mockTabs} onTabChange={onTabChange} />);

    await user.click(screen.getByText('Manga Comments'));

    expect(onTabChange).toHaveBeenCalledWith('manga');
  });

  it('supports keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup();
    render(<CommentTabs tabs={mockTabs} />);

    // Get the first tab button
    const firstTab = screen.getByRole('tab', { name: /chapter/i });

    // Use userEvent.tab to focus on the tab
    await user.tab(firstTab);
    expect(firstTab).toHaveFocus();

    // Navigate to next tab with arrow right
    await user.keyboard('{ArrowRight}');

    // Second tab should be focused and active
    const secondTab = screen.getByRole('tab', { name: /manga/i });
    expect(secondTab).toHaveFocus();
  });

  it('supports variant prop', () => {
    const { rerender } = render(<CommentTabs tabs={mockTabs} variant="default" />);

    // Should render with default variant classes
    expect(screen.getByRole('tablist')).toHaveClass('bg-muted');

    // Rerender with segmented variant
    rerender(<CommentTabs tabs={mockTabs} variant="segmented" />);

    // Should render with segmented variant classes
    expect(screen.getByRole('tablist')).toHaveClass('border-b');
  });

  it('shows disabled state for disabled tabs', () => {
    const tabsWithDisabled = [
      ...mockTabs,
      {
        id: 'following',
        label: 'Following',
        count: 0,
        content: <div>Following content</div>,
        disabled: true,
      },
    ];

    render(<CommentTabs tabs={tabsWithDisabled} />);

    const disabledTab = screen.getByRole('tab', { name: /following/i });
    expect(disabledTab).toBeDisabled();
  });

  it('displays swipe hint on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<CommentTabs tabs={mockTabs} variant="segmented" />);

    expect(screen.getByText('Swipe left or right to switch tabs')).toBeInTheDocument();
  });

  it('respects defaultTab prop', () => {
    render(<CommentTabs tabs={mockTabs} defaultTab="manga" />);

    // Should start with manga tab active
    expect(screen.getByText('Manga content')).toBeInTheDocument();
    expect(screen.queryByText('Chapter content')).not.toBeInTheDocument();
  });

  it('handles empty tabs array gracefully', () => {
    render(<CommentTabs tabs={[]} />);

    // Should not crash and should render empty component
    expect(screen.queryAllByRole('tab', { name: /chapter/i })).toHaveLength(0);
  });

  it('preserves custom className', () => {
    const customClass = 'custom-tabs-class';
    const { container } = render(<CommentTabs tabs={mockTabs} className={customClass} />);

    // The root div should have the custom class
    expect(container.firstChild).toHaveClass(customClass);
  });
});