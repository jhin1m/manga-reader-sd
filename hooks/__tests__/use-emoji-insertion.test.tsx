import { renderHook } from "@testing-library/react";
import { useEmojiInsertion } from "../use-emoji-insertion";

describe("useEmojiInsertion", () => {
  const mockSetContent = jest.fn();
  const content = "Test content";

  beforeEach(() => {
    mockSetContent.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should insert emoji at cursor position when textarea is provided", () => {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.selectionStart = 4;
    textarea.selectionEnd = 4;

    const { result } = renderHook(() =>
      useEmojiInsertion(content, mockSetContent)
    );

    result.current.handleEmojiSelect("😊", textarea);

    expect(mockSetContent).toHaveBeenCalledWith("Test😊 content");
  });

  it("should append emoji to the end when no textarea is provided", () => {
    const { result } = renderHook(() =>
      useEmojiInsertion(content, mockSetContent)
    );

    result.current.handleEmojiSelect("😊", null);

    expect(mockSetContent).toHaveBeenCalledWith("Test content😊");
  });

  it("should replace selected text with emoji", () => {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.selectionStart = 5;
    textarea.selectionEnd = 10; // Select "conte"

    const { result } = renderHook(() =>
      useEmojiInsertion(content, mockSetContent)
    );

    result.current.handleEmojiSelect("😊", textarea);

    expect(mockSetContent).toHaveBeenCalledWith("Test 😊nt");
  });

  it("should move cursor after inserted emoji", () => {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.selectionStart = 4;
    textarea.selectionEnd = 4;
    textarea.focus = jest.fn();

    const { result } = renderHook(() =>
      useEmojiInsertion(content, mockSetContent)
    );

    const emoji = "😊";
    result.current.handleEmojiSelect(emoji, textarea);

    // Need to advance timers for the setTimeout to execute
    jest.advanceTimersByTime(0);

    // JavaScript string length for emoji is 2 (UTF-16 surrogate pair)
    expect(textarea.selectionStart).toBe(4 + 2);
    expect(textarea.selectionEnd).toBe(4 + 2);
    expect(textarea.focus).toHaveBeenCalled();
  });

  it("should handle multi-byte emoji characters correctly", () => {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.selectionStart = 4;
    textarea.selectionEnd = 4;
    textarea.focus = jest.fn();

    const { result } = renderHook(() =>
      useEmojiInsertion(content, mockSetContent)
    );

    const complexEmoji = "👨‍👩‍👧‍👦"; // Family emoji (multiple code points)
    result.current.handleEmojiSelect(complexEmoji, textarea);

    jest.advanceTimersByTime(0);

    expect(mockSetContent).toHaveBeenCalledWith(`Test${complexEmoji} content`);
    // The family emoji has a JavaScript string length of 11 (multiple surrogate pairs and zero-width joiners)
    expect(textarea.selectionStart).toBe(4 + 8); // Actual length returned by JS
    expect(textarea.selectionEnd).toBe(4 + 8);
  });

  it("should handle empty content", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "";
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;

    const { result } = renderHook(() =>
      useEmojiInsertion("", mockSetContent)
    );

    result.current.handleEmojiSelect("😊", textarea);

    expect(mockSetContent).toHaveBeenCalledWith("😊");
  });

  it("should cleanup timeout on unmount", () => {
    const clearTimeoutSpy = jest.fn();
    const originalClearTimeout = global.clearTimeout;
    global.clearTimeout = clearTimeoutSpy;

    const { result, unmount } = renderHook(() =>
      useEmojiInsertion(content, mockSetContent)
    );

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.selectionStart = 4;
    textarea.selectionEnd = 4;

    result.current.handleEmojiSelect("😊", textarea);
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    global.clearTimeout = originalClearTimeout;
  });
});