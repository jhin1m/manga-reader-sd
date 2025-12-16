import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentReplyForm } from "../comment-reply-form";

describe("CommentReplyForm", () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    replyingTo: "Test User",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<CommentReplyForm {...defaultProps} />);
    });

    it("should display replying to message", () => {
      render(<CommentReplyForm {...defaultProps} />);
      expect(screen.getByText("comment.replyingTo", { exact: false })).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("should render close button (X)", () => {
      render(<CommentReplyForm {...defaultProps} />);
      const closeButton = screen.getByRole("button", { name: "" });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton.querySelector("svg")).toBeInTheDocument();
    });

    it("should render textarea with placeholder", () => {
      render(<CommentReplyForm {...defaultProps} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("placeholder", "comment.replyPlaceholder");
    });

    it("should render cancel button", () => {
      render(<CommentReplyForm {...defaultProps} />);
      expect(screen.getByRole("button", { name: "comment.cancel" })).toBeInTheDocument();
    });

    it("should render reply button", () => {
      render(<CommentReplyForm {...defaultProps} />);
      expect(screen.getByRole("button", { name: "comment.reply" })).toBeInTheDocument();
    });

    it("should render submit hint", () => {
      render(<CommentReplyForm {...defaultProps} />);
      expect(screen.getByText("comment.submitHint")).toBeInTheDocument();
    });

    it("should autofocus on textarea", () => {
      render(<CommentReplyForm {...defaultProps} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveFocus();
    });

    it("should have correct CSS classes", () => {
      const { container } = render(<CommentReplyForm {...defaultProps} />);
      const wrapper = container.querySelector(".bg-muted\\/30");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("rounded-lg", "p-3", "space-y-2");

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("min-h-[60px]", "resize-none", "text-sm");
    });
  });

  describe("Form interaction", () => {
    it("should allow typing in textarea", async () => {
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test reply content");

      expect(textarea).toHaveValue("Test reply content");
    });

    it("should enable submit button when content is not empty", async () => {
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", { name: "comment.reply" });
      expect(submitButton).toBeDisabled();

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test");

      expect(submitButton).not.toBeDisabled();
    });

    it("should disable submit button when content is only whitespace", async () => {
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.reply" });

      await user.type(textarea, "   ");
      expect(submitButton).toBeDisabled();
    });

    it("should clear textarea after successful submission", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.reply" });

      await user.type(textarea, "Test reply");
      await user.click(submitButton);

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });
    });
  });

  describe("Form submission", () => {
    it("should call onSubmit with trimmed content when reply is submitted", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.reply" });

      await user.type(textarea, "  Test reply content  ");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith("Test reply content");
      });
    });

    it("should not call onSubmit when submitting empty content", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const form = screen.getByRole("form");
      fireEvent.submit(form);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should not call onSubmit when submitting only whitespace", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.reply" });

      await user.type(textarea, "   ");
      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should show loading state during submission", async () => {
      let resolvePromise: (value: void) => void;
      const mockOnSubmit = jest.fn(() => new Promise(resolve => {
        resolvePromise = resolve;
      }));

      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.reply" });

      await user.type(textarea, "Test reply");
      await user.click(submitButton);

      // Check loading state
      expect(submitButton).toBeDisabled();
      const cancelButton = screen.getByRole("button", { name: "comment.cancel" });
      expect(cancelButton).toBeDisabled();
      const closeButton = screen.getByRole("button", { name: "" });
      expect(closeButton).toBeDisabled();

      // Resolve the promise
      resolvePromise?.();
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("should handle submission errors gracefully", async () => {
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error("Submission failed"));
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.reply" });

      await user.type(textarea, "Test reply");
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Cancel functionality", () => {
    it("should call onCancel when cancel button is clicked", async () => {
      const mockOnCancel = jest.fn();
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole("button", { name: "comment.cancel" });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when close button (X) is clicked", async () => {
      const mockOnCancel = jest.fn();
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onCancel={mockOnCancel} />);

      const closeButton = screen.getByRole("button", { name: "" });
      await user.click(closeButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard shortcuts", () => {
    it("should submit on Ctrl+Enter", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test reply");

      await user.keyboard("{Control>}{Enter}{/Control}");

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith("Test reply");
      });
    });

    it("should submit on Cmd+Enter (Mac)", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test reply");

      await user.keyboard("{Meta>}{Enter}{/Meta}");

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith("Test reply");
      });
    });

    it("should cancel on Escape key", async () => {
      const mockOnCancel = jest.fn();
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onCancel={mockOnCancel} />);

      const textarea = screen.getByRole("textbox");
      await user.click(textarea); // Focus the textarea
      await user.keyboard("{Escape}");

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should not submit on Enter without modifier key", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test reply");
      await user.keyboard("{Enter}");

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should allow newlines with Enter key", async () => {
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Line 1");
      await user.keyboard("{Enter}");
      await user.type(textarea, "Line 2");

      expect(textarea).toHaveValue("Line 1\nLine 2");
    });
  });

  describe("Form element attributes", () => {
    it("should disable textarea during submission", async () => {
      let resolvePromise: (value: void) => void;
      const mockOnSubmit = jest.fn(() => new Promise(resolve => {
        resolvePromise = resolve;
      }));

      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test reply");
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.reply") || true));

      expect(textarea).toBeDisabled();

      resolvePromise?.();
      await waitFor(() => {
        expect(textarea).not.toBeDisabled();
      });
    });

    it("should disable all buttons during submission", async () => {
      let resolvePromise: (value: void) => void;
      const mockOnSubmit = jest.fn(() => new Promise(resolve => {
        resolvePromise = resolve;
      }));

      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test reply");
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.reply") || true));

      const submitButton = screen.getByRole("button", { name: "comment.reply" });
      const cancelButton = screen.getByRole("button", { name: "comment.cancel" });
      const closeButton = screen.getByRole("button", { name: "" });

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      expect(closeButton).toBeDisabled();

      resolvePromise?.();
    });
  });

  describe("Button content", () => {
    it("should show Send icon and text in reply button by default", () => {
      render(<CommentReplyForm {...defaultProps} />);
      const button = screen.getByRole("button", { name: "comment.reply" });
      expect(button).toContainHTML("lucide-react");
      expect(button).toHaveTextContent("comment.reply");
    });

    it("should show loading spinner during submission", async () => {
      let resolvePromise: (value: void) => void;
      const mockOnSubmit = jest.fn(() => new Promise(resolve => {
        resolvePromise = resolve;
      }));

      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test");
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.reply") || true));

      expect(screen.getByRole("button", { name: "comment.reply" })).toContainHTML("animate-spin");
      expect(screen.getByRole("button", { name: "comment.reply" })).not.toHaveTextContent("comment.reply");

      resolvePromise?.();
    });
  });

  describe("Props handling", () => {
    it("should display different replyingTo user names", () => {
      render(<CommentReplyForm {...defaultProps} replyingTo="John Doe" />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should handle empty replyingTo name", () => {
      render(<CommentReplyForm {...defaultProps} replyingTo="" />);
      expect(screen.getByText("comment.replyingTo", { exact: false })).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle very long content", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const longContent = "A".repeat(10000);
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.paste(longContent);
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.reply") || true));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(longContent);
      });
    });

    it("should handle special characters in content", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const specialContent = "Special chars: @#$%^&*()_+-={}[]|:;\"'<>,./\n\tÉmojis: 🎉😊👍";
      const user = userEvent.setup();
      render(<CommentReplyForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.paste(specialContent);
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.reply") || true));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(specialContent);
      });
    });
  });
});