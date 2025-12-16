import { render, screen, fireEvent } from "@testing-library/react";
import { EmojiPickerComponent } from "../emoji-picker";

// Mock useTranslations hook
jest.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    if (namespace === "emojiPicker") {
      return (key: string) => {
        const translations: Record<string, string> = {
          search: "Search emoji...",
          noEmojiFound: "No emoji found"
        };
        return translations[key] || key;
      };
    }
    return (key: string) => key;
  }
}));

describe("EmojiPickerComponent", () => {
  const mockOnEmojiSelect = jest.fn();

  beforeEach(() => {
    mockOnEmojiSelect.mockClear();
  });

  it("renders emoji picker with search input", () => {
    render(<EmojiPickerComponent onEmojiSelect={mockOnEmojiSelect} />);

    expect(screen.getByPlaceholderText("Search emoji...")).toBeInTheDocument();
    expect(screen.getByText("😀")).toBeInTheDocument();
  });

  it("calls onEmojiSelect when emoji is clicked", () => {
    render(<EmojiPickerComponent onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByText("😀");
    fireEvent.click(emojiButton);

    expect(mockOnEmojiSelect).toHaveBeenCalledWith("😀");
  });

  it("filters emojis based on search term", () => {
    render(<EmojiPickerComponent onEmojiSelect={mockOnEmojiSelect} />);

    const searchInput = screen.getByPlaceholderText("Search emoji...");
    fireEvent.change(searchInput, { target: { value: "😀" } });

    expect(screen.getByText("😀")).toBeInTheDocument();
    expect(screen.queryByText("🎃")).not.toBeInTheDocument();
  });

  it("shows 'No emoji found' when search has no results", () => {
    render(<EmojiPickerComponent onEmojiSelect={mockOnEmojiSelect} />);

    const searchInput = screen.getByPlaceholderText("Search emoji...");
    fireEvent.change(searchInput, { target: { value: "invalid_emoji" } });

    expect(screen.getByText("No emoji found")).toBeInTheDocument();
  });

  it("closes picker after emoji selection", () => {
    render(<EmojiPickerComponent onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByText("😀");
    fireEvent.click(emojiButton);

    expect(mockOnEmojiSelect).toHaveBeenCalledTimes(1);
  });

  it("emoji buttons are focusable", () => {
    render(<EmojiPickerComponent onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByText("😀");
    expect(emojiButton).toHaveAttribute("type", "button");
  });

  it("search input is accessible", () => {
    render(<EmojiPickerComponent onEmojiSelect={mockOnEmojiSelect} />);

    const searchInput = screen.getByPlaceholderText("Search emoji...");
    expect(searchInput).toHaveAttribute("type", "text");
    expect(searchInput).toHaveClass("focus:outline-none");
  });
});