/**
 * Test Types
 * Types specifically for testing purposes
 */

/**
 * Mock user for testing
 */
export interface MockUser {
  id: string | number;
  uuid?: string;
  name: string;
  email: string;
  avatar_full_url?: string;
  avatar?: string;
}

/**
 * Mock comment for testing
 * Simplified version of Comment interface for test mocks
 */
export interface MockComment {
  id: string | number;
  uuid?: string;
  content: string;
  commentable_type?: string;
  commentable_id?: number;
  parent_id?: number | null;
  user: MockUser;
  created_at: string;
  updated_at?: string;
  replies?: MockComment[];
  replies_count?: number;
  can_edit?: boolean;
  can_delete?: boolean;
}

/**
 * Mock function type
 */
export type MockFunction = jest.Mock;

/**
 * Props for CommentReplyForm mock
 */
export interface MockCommentReplyFormProps {
  onSubmit: (content: string) => void | Promise<void>;
  onCancel: () => void;
  replyingTo: string;
}

/**
 * Helper to create a mock user
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    avatar: "https://example.com/avatar.jpg",
    ...overrides,
  };
}

/**
 * Helper to create a mock comment
 */
export function createMockComment(
  overrides: Partial<MockComment> = {}
): MockComment {
  return {
    id: "1",
    content: "Test comment",
    user: createMockUser(),
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    replies: [],
    ...overrides,
  };
}
