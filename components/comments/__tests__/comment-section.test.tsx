import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CommentSection } from "../comment-section";
import type { Comment } from "@/types/comment";

// Mock the authStore
jest.mock("@/lib/store/authStore", () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
  }),
}));

// Note: Child components are mocked in jest.setup.js

describe("CommentSection", () => {
  const mockComments: Comment[] = [
    {
      id: 1,
      uuid: "uuid-1",
      content: "Test comment 1",
      commentable_type: "manga",
      commentable_id: 1,
      parent_id: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      user: {
        id: 1,
        uuid: "user-uuid-1",
        name: "Test User 1",
        email: "test1@example.com",
        avatar_full_url: "https://example.com/avatar1.jpg",
      },
      replies: [],
      replies_count: 0,
      can_edit: false,
      can_delete: false,
    },
    {
      id: 2,
      uuid: "uuid-2",
      content: "Test comment 2",
      commentable_type: "manga",
      commentable_id: 1,
      parent_id: null,
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
      user: {
        id: 2,
        uuid: "user-uuid-2",
        name: "Test User 2",
        email: "test2@example.com",
        avatar_full_url: "https://example.com/avatar2.jpg",
      },
      replies: [],
      replies_count: 0,
      can_edit: false,
      can_delete: false,
    },
  ];

  const defaultProps = {
    comments: mockComments,
    totalCount: 2,
    isLoading: false,
    sort: "desc" as const,
    onSortChange: jest.fn(),
    onAddComment: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByText("comment.title")).toBeInTheDocument();
    });

    it("should display comment count", () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByText("(2)")).toBeInTheDocument();
    });

    it("should render loading state", () => {
      render(<CommentSection {...defaultProps} isLoading={true} />);
      expect(screen.getByTestId("comment-skeleton")).toBeInTheDocument();
    });

    it("should render empty state when no comments", () => {
      render(<CommentSection {...defaultProps} comments={[]} totalCount={0} />);
      expect(screen.getByTestId("comment-empty")).toBeInTheDocument();
    });

    it("should render comments list when there are comments", () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByTestId("comment-list")).toBeInTheDocument();
      expect(screen.getByTestId("comment-1")).toBeInTheDocument();
      expect(screen.getByTestId("comment-2")).toBeInTheDocument();
    });

    it("should render comment form when authenticated", () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByTestId("comment-form")).toBeInTheDocument();
    });
  });

  describe("Props handling", () => {
    it("should handle different total counts", () => {
      render(<CommentSection {...defaultProps} totalCount={10} />);
      expect(screen.getByText("(10)")).toBeInTheDocument();
    });

    it("should handle asc sort order", () => {
      render(<CommentSection {...defaultProps} sort="asc" />);
      expect(screen.getByText("comment.sortOldest")).toBeInTheDocument();
    });

    it("should handle desc sort order", () => {
      render(<CommentSection {...defaultProps} sort="desc" />);
      expect(screen.getByText("comment.sortNewest")).toBeInTheDocument();
    });

    it("should pass correct comments to CommentList", () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByText("Test comment 1")).toBeInTheDocument();
      expect(screen.getByText("Test comment 2")).toBeInTheDocument();
    });
  });

  describe("Interactive elements", () => {
    it("should call onSortChange when sort button is clicked", () => {
      const mockOnSortChange = jest.fn();
      render(<CommentSection {...defaultProps} onSortChange={mockOnSortChange} />);

      const sortButton = screen.getByRole("button", { name: /sortNewest/ });
      fireEvent.click(sortButton);

      expect(mockOnSortChange).toHaveBeenCalledWith("asc");
    });

    it("should call onAddComment when comment is submitted", async () => {
      const mockOnAddComment = jest.fn().mockResolvedValue(undefined);
      render(<CommentSection {...defaultProps} onAddComment={mockOnAddComment} />);

      const submitButton = screen.getByText("Submit Comment");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnAddComment).toHaveBeenCalledWith("Test comment");
      });
    });

    it("should call onAddComment with parentId when reply is submitted", async () => {
      const mockOnAddComment = jest.fn().mockResolvedValue(undefined);
      render(<CommentSection {...defaultProps} onAddComment={mockOnAddComment} />);

      const replyButton = screen.getByText("Reply to Comment");
      fireEvent.click(replyButton);

      await waitFor(() => {
        expect(mockOnAddComment).toHaveBeenCalledWith("Test reply", 1);
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<CommentSection {...defaultProps} />);
      expect(screen.getByRole("heading", { name: /comment.title/ })).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle null comments array", () => {
      render(<CommentSection {...defaultProps} comments={null as any} totalCount={0} />);
      expect(screen.getByTestId("comment-empty")).toBeInTheDocument();
    });

    it("should handle undefined comments array", () => {
      render(<CommentSection {...defaultProps} comments={undefined as any} totalCount={0} />);
      expect(screen.getByTestId("comment-empty")).toBeInTheDocument();
    });

    it("should handle negative total count", () => {
      render(<CommentSection {...defaultProps} totalCount={-1} />);
      expect(screen.getByText("(-1)")).toBeInTheDocument();
    });
  });
});