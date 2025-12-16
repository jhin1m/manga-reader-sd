import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CommentList } from "../comment-list";
import type { Comment } from "@/types/comment";

// Mock CommentItem component
jest.mock("../comment-item", () => ({
  CommentItem: ({ comment, depth, onReply }: { comment: Comment, depth: number, onReply: (content: string, parentId: number) => Promise<void> }) => (
    <li data-testid={`comment-item-${comment.id}`} data-depth={depth}>
      <div>{comment.content}</div>
      <button onClick={() => onReply(`Reply to ${comment.id}`, comment.id)}>
        Reply
      </button>
    </li>
  ),
}));

describe("CommentList", () => {
  const mockComments: Comment[] = [
    {
      id: 1,
      uuid: "uuid-1",
      content: "First comment",
      commentable_type: "manga",
      commentable_id: 1,
      parent_id: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      user: {
        id: 1,
        uuid: "user-uuid-1",
        name: "User 1",
        email: "user1@example.com",
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
      content: "Second comment",
      commentable_type: "manga",
      commentable_id: 1,
      parent_id: null,
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
      user: {
        id: 2,
        uuid: "user-uuid-2",
        name: "User 2",
        email: "user2@example.com",
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
    onReply: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<CommentList {...defaultProps} />);
    });

    it("should render all comments", () => {
      render(<CommentList {...defaultProps} />);
      expect(screen.getByTestId("comment-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("comment-item-2")).toBeInTheDocument();
      expect(screen.getByText("First comment")).toBeInTheDocument();
      expect(screen.getByText("Second comment")).toBeInTheDocument();
    });

    it("should render with correct ARIA attributes", () => {
      render(<CommentList {...defaultProps} />);
      const list = screen.getByRole("list", { name: "Comments List" });
      expect(list).toBeInTheDocument();
    });

    it("should render each comment with correct depth", () => {
      render(<CommentList {...defaultProps} />);
      const comment1 = screen.getByTestId("comment-item-1");
      const comment2 = screen.getByTestId("comment-item-2");
      expect(comment1).toHaveAttribute("data-depth", "0");
      expect(comment2).toHaveAttribute("data-depth", "0");
    });

    it("should not show load more button when hasMore is false", () => {
      render(<CommentList {...defaultProps} hasMore={false} />);
      expect(screen.queryByText("Load More Comments")).not.toBeInTheDocument();
    });

    it("should not show load more button when onLoadMore is not provided", () => {
      render(<CommentList {...defaultProps} hasMore={true} />);
      expect(screen.queryByText("Load More Comments")).not.toBeInTheDocument();
    });
  });

  describe("Load more functionality", () => {
    it("should show load more button when hasMore and onLoadMore are provided", () => {
      render(<CommentList {...defaultProps} hasMore={true} onLoadMore={jest.fn()} />);
      expect(screen.getByText("Load More Comments")).toBeInTheDocument();
    });

    it("should call onLoadMore when load more button is clicked", () => {
      const mockOnLoadMore = jest.fn();
      render(<CommentList {...defaultProps} hasMore={true} onLoadMore={mockOnLoadMore} />);

      const loadMoreButton = screen.getByText("Load More Comments");
      fireEvent.click(loadMoreButton);

      expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
    });

    it("should show loading state when isLoadingMore is true", () => {
      render(<CommentList {...defaultProps} hasMore={true} onLoadMore={jest.fn()} isLoadingMore={true} />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      const loadMoreButton = screen.getByRole("button", { name: /loading/i });
      expect(loadMoreButton).toBeDisabled();
    });

    it("should disable load more button when loading", () => {
      render(<CommentList {...defaultProps} hasMore={true} onLoadMore={jest.fn()} isLoadingMore={true} />);

      const loadMoreButton = screen.getByRole("button", { name: /loading/i });
      expect(loadMoreButton).toBeDisabled();
    });
  });

  describe("Props handling", () => {
    it("should handle empty comments array", () => {
      render(<CommentList {...defaultProps} comments={[]} />);
      const list = screen.getByRole("list", { name: "Comments List" });
      expect(list).toBeEmptyDOMElement();
    });

    it("should handle single comment", () => {
      render(<CommentList {...defaultProps} comments={[mockComments[0]]} />);
      expect(screen.getByTestId("comment-item-1")).toBeInTheDocument();
      expect(screen.getByText("First comment")).toBeInTheDocument();
      expect(screen.queryByTestId("comment-item-2")).not.toBeInTheDocument();
    });

    it("should handle null comments gracefully", () => {
      render(<CommentList {...defaultProps} comments={null as any} />);
      const list = screen.getByRole("list", { name: "Comments List" });
      expect(list).toBeEmptyDOMElement();
    });

    it("should handle undefined comments gracefully", () => {
      render(<CommentList {...defaultProps} comments={undefined as any} />);
      const list = screen.getByRole("list", { name: "Comments List" });
      expect(list).toBeEmptyDOMElement();
    });
  });

  describe("Reply functionality", () => {
    it("should call onReply with correct parameters when reply is clicked", async () => {
      const mockOnReply = jest.fn().mockResolvedValue(undefined);
      render(<CommentList {...defaultProps} onReply={mockOnReply} />);

      const replyButtons = screen.getAllByText("Reply");
      fireEvent.click(replyButtons[0]);

      await waitFor(() => {
        expect(mockOnReply).toHaveBeenCalledWith("Reply to 1", 1);
      });
    });

    it("should handle multiple replies", async () => {
      const mockOnReply = jest.fn().mockResolvedValue(undefined);
      render(<CommentList {...defaultProps} onReply={mockOnReply} />);

      const replyButtons = screen.getAllByText("Reply");

      fireEvent.click(replyButtons[0]);
      fireEvent.click(replyButtons[1]);

      await waitFor(() => {
        expect(mockOnReply).toHaveBeenCalledTimes(2);
        expect(mockOnReply).toHaveBeenCalledWith("Reply to 1", 1);
        expect(mockOnReply).toHaveBeenCalledWith("Reply to 2", 2);
      });
    });
  });

  describe("Component structure", () => {
    it("should render comments in a list container", () => {
      const { container } = render(<CommentList {...defaultProps} />);
      const list = container.querySelector("ul");
      expect(list).toBeInTheDocument();
    });

    it("should apply correct CSS classes", () => {
      const { container } = render(<CommentList {...defaultProps} />);
      const wrapper = container.querySelector(".space-y-4");
      expect(wrapper).toBeInTheDocument();
    });

    it("should render load more in correct container", () => {
      render(<CommentList {...defaultProps} hasMore={true} onLoadMore={jest.fn()} />);
      const loadMoreContainer = document.querySelector(".flex.justify-center.pt-2");
      expect(loadMoreContainer).toBeInTheDocument();
    });
  });
});