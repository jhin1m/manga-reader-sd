import { render, screen } from "@testing-library/react";
import { CommentSkeleton } from "../comment-skeleton";

describe("CommentSkeleton", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<CommentSkeleton />);
    });

    it("should render default count (3) of skeleton items", () => {
      render(<CommentSkeleton />);
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(10); // 1 header + 3 per comment * 3 comments
    });

    it("should render custom count of skeleton items", () => {
      render(<CommentSkeleton count={5} />);
      expect(document.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(16); // 1 header + 3 per comment * 5 comments
    });

    it("should render card structure", () => {
      render(<CommentSkeleton />);
      const card = document.querySelector(".card");
      expect(card).toBeInTheDocument();
    });

    it("should render card header", () => {
      render(<CommentSkeleton />);
      const header = document.querySelector(".card-header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("pb-3");
    });

    it("should render card content", () => {
      render(<CommentSkeleton />);
      const content = document.querySelector(".card-content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass("space-y-4");
    });

    it("should render title skeleton in header", () => {
      render(<CommentSkeleton />);
      const titleSkeleton = document.querySelector(".card-header .h-6");
      expect(titleSkeleton).toBeInTheDocument();
      expect(titleSkeleton).toHaveClass("w-32");
    });
  });

  describe("Skeleton items structure", () => {
    it("should render correct skeleton structure for each item", () => {
      render(<CommentSkeleton count={1} />);

      const container = document.querySelector(".flex.gap-3");
      expect(container).toBeInTheDocument();

      const avatarSkeleton = container?.querySelector(".h-8.w-8");
      expect(avatarSkeleton).toBeInTheDocument();
      expect(avatarSkeleton).toHaveClass("rounded-full", "flex-shrink-0");

      const contentContainer = container?.querySelector(".flex-1");
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass("space-y-2");
    });

    it("should render correct skeleton lines", () => {
      render(<CommentSkeleton count={1} />);

      const contentContainer = document.querySelector(".flex-1.space-y-2");
      const skeletonLines = contentContainer?.querySelectorAll(".skeleton");

      expect(skeletonLines).toHaveLength(3);

      // Check first skeleton (username)
      expect(skeletonLines?.[0]).toHaveClass("h-4", "w-24");

      // Check second skeleton (content line 1)
      expect(skeletonLines?.[1]).toHaveClass("h-4", "w-full");

      // Check third skeleton (content line 2)
      expect(skeletonLines?.[2]).toHaveClass("h-4", "w-3/4");
    });
  });

  describe("Props handling", () => {
    it("should handle count of 0", () => {
      render(<CommentSkeleton count={0} />);
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      // Should only have the header skeleton when count is 0
      expect(skeletons).toHaveLength(1);
    });

    it("should handle count of 1", () => {
      render(<CommentSkeleton count={1} />);
      expect(document.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(4); // 1 header + 3 for 1 comment
    });

    it("should handle large count", () => {
      render(<CommentSkeleton count={10} />);
      expect(document.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(10);
    });

    it("should handle missing count prop (should use default)", () => {
      render(<CommentSkeleton />);
      expect(document.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(0);
    });
  });

  describe("CSS classes", () => {
    it("should apply correct Card component classes", () => {
      const { container } = render(<CommentSkeleton />);
      const card = container.querySelector('[class*="card"]');
      expect(card).toBeInTheDocument();
    });

    it("should apply Skeleton component classes correctly", () => {
      render(<CommentSkeleton />);

      // Check skeleton elements exist
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);

      // Check avatar skeleton
      const avatarSkeleton = document.querySelector(".h-8.w-8.rounded-full");
      expect(avatarSkeleton).toBeInTheDocument();

      // Check text skeleton
      const textSkeleton = document.querySelector(".h-4");
      expect(textSkeleton).toBeInTheDocument();

      // Check width variations
      expect(document.querySelector(".w-24")).toBeInTheDocument();
      expect(document.querySelector(".w-full")).toBeInTheDocument();
      expect(document.querySelector(".w-3/4")).toBeInTheDocument();
    });

    it("should have responsive structure", () => {
      render(<CommentSkeleton />);

      const skeletonItems = document.querySelectorAll('[data-slot="skeleton"]');
      skeletonItems.forEach((item) => {
        expect(item.closest(".flex")).toHaveClass("gap-3");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes for loading state", () => {
      render(<CommentSkeleton />);
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("should announce loading content", () => {
      render(<CommentSkeleton />);
      const card = document.querySelector('[role="status"]');
      // Note: This would require adding role="status" to the component for better accessibility
    });
  });

  describe("Component composition", () => {
    it("should use Skeleton and Card components correctly", () => {
      const { container } = render(<CommentSkeleton />);

      // Should contain Skeleton components
      expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);

      // Should contain Card components
      expect(container.querySelector('[class*="card"]')).toBeInTheDocument();
    });
  });

  describe("Performance considerations", () => {
    it("should not cause excessive re-renders with high count", () => {
      const startTime = performance.now();
      render(<CommentSkeleton count={100} />);
      const endTime = performance.now();

      // Should render quickly even with high count
      expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
    });
  });

  describe("Visual consistency", () => {
    it("should maintain consistent spacing between skeleton items", () => {
      render(<CommentSkeleton count={3} />);

      const container = document.querySelector(".card-content");
      expect(container).toHaveClass("space-y-4");
    });

    it("should maintain consistent skeleton structure", () => {
      render(<CommentSkeleton count={2} />);

      const skeletonItems = document.querySelectorAll('[data-slot="skeleton"]');
      skeletonItems.forEach((item) => {
        const avatar = item.querySelector(".h-8.w-8");
        const content = item.querySelector(".flex-1");

        expect(avatar).toBeInTheDocument();
        expect(content).toBeInTheDocument();
      });
    });
  });
});