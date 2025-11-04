import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number for display
 * Converts large numbers to K/M format for better readability
 *
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.2K", "3.5M")
 *
 * @example
 * formatNumber(1234) // "1.2K"
 * formatNumber(1234567) // "1.2M"
 * formatNumber(500) // "500"
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
