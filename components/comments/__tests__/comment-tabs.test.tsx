import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentTabs } from "../comment-tabs";

// Mock framer-motion to prevent animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations:
    (namespace?: string) =>
    (key: string, _params?: Record<string, unknown>) => {
      // Root level translations (no namespace)
      const rootTranslations: Record<string, string> = {
        swipeHint: "Swipe left or right to switch tabs",
        activeTab: "Currently viewing {tab} tab",
      };

      // Namespaced translations
      const namespacedTranslations: Record<string, Record<string, string>> = {
        tabs: {
          chapterComments: "Chapter Comments",
          mangaComments: "Manga Comments",
          allComments: "All Comments",
        },
      };

      // If no namespace provided, look in root translations
      if (!namespace) {
        return rootTranslations[key] || key;
      }

      // Look in namespaced translations
      if (namespacedTranslations[namespace]) {
        return namespacedTranslations[namespace][key] || `${namespace}.${key}`;
      }

      return `${namespace}.${key}`;
    },
}));

describe("CommentTabs", () => {
  const mockTabs = [
    {
      id: "chapter",
      label: "Chapter Comments",
      count: 25,
      content: <div>Chapter content</div>,
    },
    {
      id: "manga",
      label: "Manga Comments",
      count: 142,
      content: <div>Manga content</div>,
    },
    {
      id: "all",
      label: "All Comments",
      count: 167,
      content: <div>All comments content</div>,
    },
  ];

  it("renders all tabs with correct labels and counts", () => {
    render(<CommentTabs tabs={mockTabs} />);

    // Use getAllByText since labels may appear in both tab and sr-only regions
    expect(
      screen.getAllByText("Chapter Comments").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getAllByText("Manga Comments").length).toBeGreaterThanOrEqual(
      1
    );
    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getAllByText("All Comments").length).toBeGreaterThanOrEqual(
      1
    );
    expect(screen.getByText("167")).toBeInTheDocument();
  });

  it("switches tabs when clicked", async () => {
    const user = userEvent.setup();
    render(<CommentTabs tabs={mockTabs} />);

    // Initially on chapter tab
    expect(screen.getByText("Chapter content")).toBeInTheDocument();
    expect(screen.queryByText("Manga content")).not.toBeInTheDocument();

    // Click manga tab using role selector to avoid ambiguity
    const mangaTab = screen.getByRole("tab", { name: /manga/i });
    await user.click(mangaTab);

    // Should show manga content
    await waitFor(() => {
      expect(screen.getByText("Manga content")).toBeInTheDocument();
      expect(screen.queryByText("Chapter content")).not.toBeInTheDocument();
    });
  });

  it("calls onTabChange when tab switches", async () => {
    const onTabChange = jest.fn();
    const user = userEvent.setup();

    render(<CommentTabs tabs={mockTabs} onTabChange={onTabChange} />);

    // Use role selector to avoid ambiguity
    const mangaTab = screen.getByRole("tab", { name: /manga/i });
    await user.click(mangaTab);

    expect(onTabChange).toHaveBeenCalledWith("manga");
  });

  it("supports keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup();
    render(<CommentTabs tabs={mockTabs} />);

    // Get the first tab button
    const firstTab = screen.getByRole("tab", { name: /chapter/i });

    // Use userEvent.tab to focus on the tab
    await user.tab(firstTab);
    expect(firstTab).toHaveFocus();

    // Navigate to next tab with arrow right
    await user.keyboard("{ArrowRight}");

    // Second tab should be focused and active
    const secondTab = screen.getByRole("tab", { name: /manga/i });
    expect(secondTab).toHaveFocus();
  });

  it("supports variant prop", () => {
    const { rerender } = render(
      <CommentTabs tabs={mockTabs} variant="default" />
    );

    // Should render with default variant classes
    expect(screen.getByRole("tablist")).toHaveClass("bg-muted");

    // Rerender with segmented variant
    rerender(<CommentTabs tabs={mockTabs} variant="segmented" />);

    // Should render with segmented variant classes
    expect(screen.getByRole("tablist")).toHaveClass("border-b");
  });

  it("shows disabled state for disabled tabs", () => {
    const tabsWithDisabled = [
      ...mockTabs,
      {
        id: "following",
        label: "Following",
        count: 0,
        content: <div>Following content</div>,
        disabled: true,
      },
    ];

    render(<CommentTabs tabs={tabsWithDisabled} />);

    const disabledTab = screen.getByRole("tab", { name: /following/i });
    expect(disabledTab).toBeDisabled();
  });

  it("displays swipe hint on mobile", () => {
    // Mock mobile viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<CommentTabs tabs={mockTabs} variant="segmented" />);

    expect(
      screen.getByText("Swipe left or right to switch tabs")
    ).toBeInTheDocument();
  });

  it("respects defaultTab prop", () => {
    render(<CommentTabs tabs={mockTabs} defaultTab="manga" />);

    // Should start with manga tab active
    expect(screen.getByText("Manga content")).toBeInTheDocument();
    expect(screen.queryByText("Chapter content")).not.toBeInTheDocument();
  });

  it("handles empty tabs array gracefully", () => {
    render(<CommentTabs tabs={[]} />);

    // Should not crash and should render empty component
    expect(screen.queryAllByRole("tab", { name: /chapter/i })).toHaveLength(0);
  });

  it("preserves custom className", () => {
    const customClass = "custom-tabs-class";
    const { container } = render(
      <CommentTabs tabs={mockTabs} className={customClass} />
    );

    // The root div should have the custom class
    expect(container.firstChild).toHaveClass(customClass);
  });
});
