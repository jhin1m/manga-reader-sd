import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentForm } from "../comment-form";

describe("CommentForm", () => {
  const defaultProps = {
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<CommentForm {...defaultProps} />);
    });

    it("should render textarea with default placeholder", () => {
      render(<CommentForm {...defaultProps} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("placeholder", "comment.placeholder");
    });

    it("should render textarea with custom placeholder", () => {
      render(<CommentForm {...defaultProps} placeholder="Write a comment..." />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("placeholder", "Write a comment...");
    });

    it("should render submit button", () => {
      render(<CommentForm {...defaultProps} />);
      const submitButton = screen.getByRole("button", { name: "comment.submit" });
      expect(submitButton).toBeInTheDocument();
    });

    it("should render submit hint", () => {
      render(<CommentForm {...defaultProps} />);
      expect(screen.getByText("comment.submitHint")).toBeInTheDocument();
    });

    it("should have correct CSS classes", () => {
      const { container } = render(<CommentForm {...defaultProps} />);
      const form = container.querySelector("form");
      expect(form).toHaveClass("space-y-2");

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("min-h-[80px]", "resize-none");
    });
  });

  describe("Form interaction", () => {
    it("should allow typing in textarea", async () => {
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test comment content");

      expect(textarea).toHaveValue("Test comment content");
    });

    it("should enable submit button when content is not empty", async () => {
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", { name: "comment.submit" });
      expect(submitButton).toBeDisabled();

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test");

      expect(submitButton).not.toBeDisabled();
    });

    it("should disable submit button when content is only whitespace", async () => {
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.submit" });

      await user.type(textarea, "   ");
      expect(submitButton).toBeDisabled();
    });

    it("should clear textarea after successful submission", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.submit" });

      await user.type(textarea, "Test comment");
      await user.click(submitButton);

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });
    });
  });

  describe("Form submission", () => {
    it("should call onSubmit with trimmed content when form is submitted", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.submit" });

      await user.type(textarea, "  Test comment content  ");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith("Test comment content");
      });
    });

    it("should not call onSubmit when submitting empty content", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const form = screen.getByRole("form");
      fireEvent.submit(form);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should not call onSubmit when submitting only whitespace", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.submit" });

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
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.submit" });

      await user.type(textarea, "Test comment");
      await user.click(submitButton);

      // Check loading state
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole("button")).toContainHTML("animate-spin");

      // Resolve the promise
      await waitFor(() => {
        resolvePromise?.();
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("should handle submission errors gracefully", async () => {
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error("Submission failed"));
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "comment.submit" });

      await user.type(textarea, "Test comment");
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Keyboard shortcuts", () => {
    it("should submit on Ctrl+Enter", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test comment");

      await user.keyboard("{Control>}{Enter}{/Control}");

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith("Test comment");
      });
    });

    it("should submit on Cmd+Enter (Mac)", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test comment");

      await user.keyboard("{Meta>}{Enter}{/Meta}");

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith("Test comment");
      });
    });

    it("should not submit on Enter without modifier key", async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test comment");
      await user.keyboard("{Enter}");

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should allow newlines with Enter key", async () => {
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} />);

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
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test comment");
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.submit") || true));

      expect(textarea).toBeDisabled();

      resolvePromise?.();
      await waitFor(() => {
        expect(textarea).not.toBeDisabled();
      });
    });

    it("should have proper form structure", () => {
      const { container } = render(<CommentForm {...defaultProps} />);
      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();

      const textarea = form!.querySelector("textarea");
      expect(textarea).toBeInTheDocument();

      const buttonDiv = form!.querySelector(".flex.items-center.justify-between");
      expect(buttonDiv).toBeInTheDocument();
    });
  });

  describe("Submit button content", () => {
    it("should show Send icon and text by default", () => {
      render(<CommentForm {...defaultProps} />);
      const button = screen.getByRole("button", { name: "comment.submit" });
      expect(button).toContainHTML("lucide-react");
      expect(button).toHaveTextContent("comment.submit");
    });

    it("should show loading spinner during submission", async () => {
      let resolvePromise: (value: void) => void;
      const mockOnSubmit = jest.fn(() => new Promise(resolve => {
        resolvePromise = resolve;
      }));

      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test");
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.submit") || true));

      expect(screen.getByRole("button")).toContainHTML("animate-spin");
      expect(screen.getByRole("button")).not.toHaveTextContent("comment.submit");

      resolvePromise?.();
    });
  });

  describe("Edge cases", () => {
    it("should handle very long content", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const longContent = "A".repeat(10000);
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.paste(longContent);
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.submit") || true));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(longContent);
      });
    });

    it("should handle special characters in content", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const specialContent = "Special chars: @#$%^&*()_+-={}[]|:;\"'<>,./\n\tÉmojis: 🎉😊👍";
      const user = userEvent.setup();
      render(<CommentForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const textarea = screen.getByRole("textbox");
      await user.paste(specialContent);
      await user.click(screen.getByRole("button").filter(el => el.textContent?.includes("comment.submit") || true));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(specialContent);
      });
    });
  });
});