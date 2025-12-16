import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: (namespace) => (key, params) => {
    const translations = {
      comment: {
        title: "Comments",
        placeholder: "Write your comment...",
        replyPlaceholder: "Reply to @{name}...",
        replyingTo: "Replying to @{name}",
        cancel: "Cancel",
        submit: "Submit",
        submitHint: "Ctrl + Enter to submit",
        reply: "Reply",
        loading: "Loading...",
        loadMore: "Load More Comments",
        sortNewest: "Newest",
        sortOldest: "Oldest",
        showReplies: "View {count} replies",
        hideReplies: "Hide replies",
        empty: "No comments yet",
        emptyHint: "Be the first to comment!",
        listLabel: "Comments List",
        loginRequired: "Login to comment",
        addSuccess: "Comment added",
        addError: "Failed to add comment",
        badge: {
          chapter: "CH",
          manga: "MG",
          chapterAria: "Chapter comment",
          mangaAria: "Manga comment",
          chapterTooltip: "Comment about this chapter",
          mangaTooltip: "Comment about the entire manga",
        },
        errors: {
          contentRequired: "Please enter content",
          contentTooLong: "Comment too long (max 2000 characters)",
        },
        tabs: {
          chapterComments: "Chapter Comments",
          mangaComments: "Manga Comments",
          allComments: "All Comments",
        },
        activeTab: (params) => `Currently viewing ${params.tab} tab`,
        swipeHint: "Swipe left or right to switch tabs",
      },
      common: {
        reply: "Reply",
        cancel: "Cancel",
        loading: "Loading...",
      },
    };

    // If we have a namespace, look in that namespace
    if (namespace && translations[namespace]) {
      const value = translations[namespace][key];
      return typeof value === "function" ? value(params || {}) : value || `${namespace}.${key}`;
    }

    // Fallback for nested keys like "comment.badge.chapter"
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === "function" ? value(params || {}) : value || key;
  },
  useLocale: () => "en",
  IntlProvider: ({ children }) => children,
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
}));

// Mock React Query
jest.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
  useMutation: () => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
    error: null,
  }),
  QueryClient: jest.fn(),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
    refetchQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  }),
}));
