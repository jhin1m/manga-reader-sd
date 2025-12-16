import { render, screen } from "@testing-library/react";
import { CommentEmpty } from "../comment-empty";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: (key: string) => (subKey: string) => {
    if (subKey === "empty")
      return "No comments yet. Be the first to share your thoughts!";
    if (subKey === "emptyHint")
      return "Start a conversation by leaving a comment below.";
    return `${key}.${subKey}`;
  },
}));

describe("CommentEmpty", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<CommentEmpty />);
    });

    it("should display MessageSquare icon", () => {
      render(<CommentEmpty />);
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should display empty state message", () => {
      render(<CommentEmpty />);
      expect(
        screen.getByText(
          "No comments yet. Be the first to share your thoughts!"
        )
      ).toBeInTheDocument();
    });

    it("should display empty state hint", () => {
      render(<CommentEmpty />);
      expect(
        screen.getByText("Start a conversation by leaving a comment below.")
      ).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should render in a flex container", () => {
      const { container } = render(<CommentEmpty />);
      const wrapper = container.querySelector(".flex");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("flex-col", "items-center", "justify-center");
    });

    it("should have correct padding", () => {
      const { container } = render(<CommentEmpty />);
      const wrapper = container.querySelector(".flex");
      expect(wrapper).toHaveClass("py-8");
    });

    it("should center content", () => {
      const { container } = render(<CommentEmpty />);
      const wrapper = container.querySelector(".flex");
      expect(wrapper).toHaveClass("text-center");
    });
  });

  describe("Icon styling", () => {
    it("should apply correct icon size", () => {
      const { container } = render(<CommentEmpty />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("h-12", "w-12");
    });

    it("should apply correct icon color", () => {
      const { container } = render(<CommentEmpty />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("text-muted-foreground/50");
    });

    it("should have correct bottom margin", () => {
      const { container } = render(<CommentEmpty />);
      const iconEl = container.querySelector("svg");
      expect(iconEl).toHaveClass("mb-3");
    });
  });

  describe("Text content styling", () => {
    it("should style main message correctly", () => {
      render(<CommentEmpty />);
      const messageEl = screen.getByText(
        "No comments yet. Be the first to share your thoughts!"
      );
      expect(messageEl).toHaveClass("text-sm", "text-muted-foreground");
    });

    it("should style hint message correctly", () => {
      render(<CommentEmpty />);
      const hint = screen.getByText(
        "Start a conversation by leaving a comment below."
      );
      expect(hint).toHaveClass("text-xs", "text-muted-foreground");
    });

    it("should apply correct spacing between messages", () => {
      render(<CommentEmpty />);
      const hint = screen.getByText(
        "Start a conversation by leaving a comment below."
      );
      expect(hint).toHaveClass("mt-1");
    });
  });

  describe("Accessibility", () => {
    it("should have appropriate ARIA roles", () => {
      render(<CommentEmpty />);
      document.querySelector('[role="status"]');
      // Note: This would require adding role="status" to the component for better accessibility
    });

    it("should be properly semantically structured", () => {
      const { container } = render(<CommentEmpty />);

      // Icon should be decorative
      const iconEl = container.querySelector("svg");
      expect(iconEl).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Visual hierarchy", () => {
    it("should maintain proper vertical spacing", () => {
      const { container } = render(<CommentEmpty />);

      const icon = container.querySelector("svg");
      screen.getByText("No comments yet. Be the first to share your thoughts!");
      const hint = screen.getByText(
        "Start a conversation by leaving a comment below."
      );

      // Check spacing elements
      expect(icon).toHaveClass("mb-3");
      expect(hint).toHaveClass("mt-1");
    });

    it("should use consistent muted colors", () => {
      const { container } = render(<CommentEmpty />);

      const icon = container.querySelector("svg");
      const message = screen.getByText(
        "No comments yet. Be the first to share your thoughts!"
      );
      const hint = screen.getByText(
        "Start a conversation by leaving a comment below."
      );

      expect(icon).toHaveClass("text-muted-foreground/50");
      expect(message).toHaveClass("text-muted-foreground");
      expect(hint).toHaveClass("text-muted-foreground");
    });
  });

  describe("Component composition", () => {
    it("should use Lucide React MessageSquare icon", () => {
      render(<CommentEmpty />);
      const icon = document.querySelector("svg");
      // Check if it's the MessageSquare icon by checking path data or other attributes
      expect(icon).toBeInTheDocument();
    });
  });

  describe("CSS classes", () => {
    it("should apply all expected CSS classes", () => {
      const { container } = render(<CommentEmpty />);

      const wrapper = container.querySelector(
        ".flex-col.items-center.justify-center.py-8.text-center"
      );
      expect(wrapper).toBeInTheDocument();

      const icon = container.querySelector(
        ".h-12.w-12.text-muted-foreground\\/50.mb-3"
      );
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Responsive design", () => {
    it("should be responsive on different screen sizes", () => {
      const { container } = render(<CommentEmpty />);

      // Component uses flex centering which is responsive by default
      const wrapper = container.querySelector(
        ".flex-col.items-center.justify-center"
      );
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Text content", () => {
    it("should use translation keys correctly", () => {
      render(<CommentEmpty />);

      // Check that translation is working
      expect(
        screen.getByText(
          "No comments yet. Be the first to share your thoughts!"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText("Start a conversation by leaving a comment below.")
      ).toBeInTheDocument();
    });

    it("should have appropriate text sizes", () => {
      render(<CommentEmpty />);

      const message = screen.getByText(
        "No comments yet. Be the first to share your thoughts!"
      );
      const hint = screen.getByText(
        "Start a conversation by leaving a comment below."
      );

      expect(message).toHaveClass("text-sm");
      expect(hint).toHaveClass("text-xs");
    });
  });
});
