import { renderHook } from "@testing-library/react";
import { useRelativeTime } from "../use-relative-time";

describe("useRelativeTime", () => {
  it("should return relative time for valid timestamp", () => {
    const pastDate = new Date(Date.now() - 60000).toISOString(); // 1 minute ago
    const { result } = renderHook(() => useRelativeTime(pastDate));

    expect(result.current).toBeTruthy();
    expect(typeof result.current).toBe("string");
  });

  it("should handle invalid timestamp", () => {
    const { result } = renderHook(() => useRelativeTime("invalid-date"));

    expect(result.current).toBe("unknown time");
  });

  it("should handle Date object input", () => {
    const pastDate = new Date(Date.now() - 60000); // 1 minute ago
    const { result } = renderHook(() => useRelativeTime(pastDate));

    expect(result.current).toBeTruthy();
    expect(typeof result.current).toBe("string");
  });

  it("should return relative time for different locales", () => {
    const pastDate = new Date(Date.now() - 60000).toISOString(); // 1 minute ago
    const { result } = renderHook(() =>
      useRelativeTime(pastDate, { locale: "en" })
    );

    expect(result.current).toBeTruthy();
    expect(typeof result.current).toBe("string");
  });

  it("should handle empty timestamp", () => {
    const { result } = renderHook(() => useRelativeTime(""));

    expect(result.current).toBeTruthy();
    expect(typeof result.current).toBe("string");
  });
});
