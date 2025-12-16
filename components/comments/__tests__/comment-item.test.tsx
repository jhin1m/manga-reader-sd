import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CommentItem } from "../comment-item";
import type { Comment } from "@/types/comment";

// Mock date-fns to have consistent dates
jest.mock("date-fns", () => ({
  formatDistanceToNow: jest.fn(() => "2 hours ago"),
}));

// Mock authStore
jest.mock("@/lib/store/authStore", () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
  }),
}));

// Mock CommentReplyForm
jest.mock("../comment-reply-form", () => ({
  CommentReplyForm: ({ onSubmit, onCancel, replyingTo }: any) => (
    <div data-testid="comment-reply-form">
      <span>Replying to {replyingTo}</span>
      <button onClick={() => onSubmit("Test reply content")}>Submit Reply</button>
      <button onClick={onCancel}>Cancel Reply</button>
    </div>
  ),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: (key: string) => (subKey: string, params?: any) => {
    const translations: Record<string, Record<string, string | Function>> = {
      comment: {
        reply: "Reply",
        hideReplies: "Hide replies",
        showReplies: (params: any) => `Show ${params.count} replies`,
        replyHint: "Press Ctrl+Enter to submit",
      },
    };
    const value = translations[key]?.[subKey];
    return typeof value === "function" ? value(params || {}) : value || `${key}.${subKey}`;
  },
}));

describe("CommentItem", () => {
  const createMockComment = (overrides: Partial<Comment> = {}): Comment => ({
    id: 1,
    uuid: "uuid-1",
    content: "Test comment content",
    commentable_type: "manga",
    commentable_id: 1,
    parent_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: {
      id: 1,
      uuid: "user-uuid-1",
      name: "Test User",
      email: "test@example.com",
      avatar_full_url: "https://example.com/avatar.jpg",
    },
    replies: [],
    replies_count: 0,
    can_edit: false,
    can_delete: false,
    ...overrides,
  });

  const defaultProps = {
    comment: createMockComment(),
    depth: 0,
    onReply: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<CommentItem {...defaultProps} />);
    });

    it("should display user name", () => {
      render(<CommentItem {...defaultProps} />);
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("should display comment content", () => {
      render(<CommentItem {...defaultProps} />);
      expect(screen.getByText("Test comment content")).toBeInTheDocument();
    });

    it("should display time ago", () => {
      render(<CommentItem {...defaultProps} />);
      expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    });

    it("should display user avatar with correct alt text", () => {
      render(<CommentItem {...defaultProps} />);
      const avatar = screen.getByRole("img", { name: "Test User" });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("should display avatar fallback with first letter", () => {
      render(<CommentItem {...defaultProps} />);
      const fallback = screen.getByText("T");
      expect(fallback).toBeInTheDocument();
    });

    it("should apply correct ARIA level attribute", () => {
      render(<CommentItem {...defaultProps} depth={2} />);
      const listItem = screen.getByRole("listitem");
      expect(listItem).toHaveAttribute("aria-level", "3");
    });
  });

  describe("Depth handling", () => {
    it("should not add indentation for depth 0", () => {
      render(<CommentItem {...defaultProps} depth={0} />);
      const listItem = screen.getByRole("listitem");
      expect(listItem).not.toHaveClass("ml-6");
      expect(listItem).not.toHaveClass("sm:ml-10");
    });

    it("should add indentation for depth > 0", () => {
      render(<CommentItem {...defaultProps} depth={1} />);
      const listItem = screen.getByRole("listitem");
      expect(listItem).toHaveClass("ml-6", "sm:ml-10");
    });

    it("should show replies by default for depth < 2", () => {
      const comment = createMockComment({
        replies: [createMockComment({ id: 2 })],
        replies_count: 1,
      });
      render(<CommentItem {...defaultProps} comment={comment} depth={1} />);
      expect(screen.getByTestId("comment-item-2")).toBeInTheDocument();
    });

    it("should hide replies by default for depth >= 2", () => {
      const comment = createMockComment({
        replies: [createMockComment({ id: 2 })],
        replies_count: 1,
      });
      render(<CommentItem {...defaultProps} comment={comment} depth={2} />);
      expect(screen.queryByTestId("comment-item-2")).not.toBeInTheDocument();
    });
  });

  describe("Reply functionality", () => {
    it("should show reply button when authenticated", () => {
      render(<CommentItem {...defaultProps} />);
      expect(screen.getByText("Reply")).toBeInTheDocument();
    });

    it("should not show reply button when not authenticated", () => {
      jest.mocked(require("@/lib/store/authStore").useAuthStore).mockReturnValue({
        isAuthenticated: false,
      });
      render(<CommentItem {...defaultProps} />);
      expect(screen.queryByText("Reply")).not.toBeInTheDocument();
    });

    it("should not show reply button at max depth", () => {
      render(<CommentItem {...defaultProps} depth={3} />);
      expect(screen.queryByText("Reply")).not.toBeInTheDocument();
    });

    it("should show reply form when reply button is clicked", () => {
      render(<CommentItem {...defaultProps} />);
      const replyButton = screen.getByText("Reply");
      fireEvent.click(replyButton);
      expect(screen.getByTestId("comment-reply-form")).toBeInTheDocument();
      expect(screen.getByText("Replying to Test User")).toBeInTheDocument();
    });

    it("should hide reply form when reply button is clicked again", () => {
      render(<CommentItem {...defaultProps} />);
      const replyButton = screen.getByText("Reply");

      // Show reply form
      fireEvent.click(replyButton);
      expect(screen.getByTestId("comment-reply-form")).toBeInTheDocument();

      // Hide reply form
      fireEvent.click(replyButton);
      expect(screen.queryByTestId("comment-reply-form")).not.toBeInTheDocument();
    });

    it("should call onReply when reply is submitted", async () => {
      const mockOnReply = jest.fn().mockResolvedValue(undefined);
      render(<CommentItem {...defaultProps} onReply={mockOnReply} />);

      // Show reply form
      const replyButton = screen.getByText("Reply");
      fireEvent.click(replyButton);

      // Submit reply
      const submitButton = screen.getByText("Submit Reply");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnReply).toHaveBeenCalledWith("Test reply content", 1);
      });
    });

    it("should hide reply form after successful submission", async () => {
      const mockOnReply = jest.fn().mockResolvedValue(undefined);
      render(<CommentItem {...defaultProps} onReply={mockOnReply} />);

      // Show reply form
      const replyButton = screen.getByText("Reply");
      fireEvent.click(replyButton);

      // Submit reply
      const submitButton = screen.getByText("Submit Reply");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId("comment-reply-form")).not.toBeInTheDocument();
      });
    });
  });

  describe("Nested replies", () => {
    const createNestedComment = (depth: number = 0): Comment => {
      if (depth >= 3) {
        return createMockComment({ id: depth + 1 });
      }

      return createMockComment({
        id: depth + 1,
        replies: [createNestedComment(depth + 1)],
        replies_count: 1,
      });
    };

    it("should render nested replies recursively", () => {
      const comment = createMockComment({
        id: 1,
        replies: [
          createMockComment({
            id: 2,
            replies: [createMockComment({ id: 3 })],
            replies_count: 1,
          }),
        ],
        replies_count: 2,
      });

      render(<CommentItem {...defaultProps} comment={comment} depth={0} />);

      expect(screen.getByTestId("comment-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("comment-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("comment-item-3")).toBeInTheDocument();
    });

    it("should show/hide replies button when there are replies", () => {
      const comment = createMockComment({
        replies: [createMockComment({ id: 2 })],
        replies_count: 1,
      });

      render(<CommentItem {...defaultProps} comment={comment} depth={2} />);

      expect(screen.getByText("Show 1 replies")).toBeInTheDocument();
    });

    it("should toggle replies visibility when button is clicked", () => {
      const comment = createMockComment({
        replies: [createMockComment({ id: 2 })],
        replies_count: 1,
      });

      render(<CommentItem {...defaultProps} comment={comment} depth={2} />);

      // Initially hidden
      expect(screen.queryByTestId("comment-item-2")).not.toBeInTheDocument();

      // Show replies
      const showButton = screen.getByText("Show 1 replies");
      fireEvent.click(showButton);
      expect(screen.getByTestId("comment-item-2")).toBeInTheDocument();

      // Hide replies
      const hideButton = screen.getByText("Hide replies");
      fireEvent.click(hideButton);
      expect(screen.queryByTestId("comment-item-2")).not.toBeInTheDocument();
    });

    it("should respect MAX_DEPTH limit", () => {
      const deepComment = createNestedComment(0);
      render(<CommentItem {...defaultProps} comment={deepComment} depth={0} />);

      // Check that we don't have reply button at max depth
      const deepestItem = screen.getByTestId("comment-item-4");
      expect(deepestItem).toBeInTheDocument();

      // Should not have a reply button for the deepest item
      expect(deepestItem).not.toContainHTML("Reply");
    });
  });

  describe("Content handling", () => {
    it("should preserve whitespace in comment content", () => {
      const comment = createMockComment({
        content: "Line 1\n\nLine 2 with  spaces",
      });
      render(<CommentItem {...defaultProps} comment={comment} />);

      const contentElement = screen.getByText(/Line 1\n\nLine 2 with  spaces/);
      expect(contentElement).toHaveClass("whitespace-pre-wrap");
    });

    it("should break long words", () => {
      const comment = createMockComment({
        content: "Thisisaverylongwordthatshouldbreak".repeat(10),
      });
      render(<CommentItem {...defaultProps} comment={comment} />);

      const contentElement = screen.getByText(/Thisisaverylongword/);
      expect(contentElement).toHaveClass("break-words");
    });
  });

  describe("Edge cases", () => {
    it("should handle comment without user avatar", () => {
      const comment = createMockComment({
        user: {
          ...defaultProps.comment.user,
          avatar_full_url: "",
        },
      });
      render(<CommentItem {...defaultProps} comment={comment} />);

      const avatar = screen.getByRole("img");
      expect(avatar).toHaveAttribute("src", "");
    });

    it("should handle user with empty name", () => {
      const comment = createMockComment({
        user: {
          ...defaultProps.comment.user,
          name: "",
        },
      });
      render(<CommentItem {...defaultProps} comment={comment} />);

      const fallback = screen.getByText("");
      expect(fallback).toBeInTheDocument();
    });

    it("should handle comment with no replies but replies_count > 0", () => {
      const comment = createMockComment({
        replies: [],
        replies_count: 5,
      });
      render(<CommentItem {...defaultProps} comment={comment} depth={2} />);

      expect(screen.getByText("Show 5 replies")).toBeInTheDocument();
    });
  });
});