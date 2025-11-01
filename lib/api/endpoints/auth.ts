/**
 * Authentication API Endpoints
 * All endpoints related to user authentication
 */

import { apiClient } from "../client";
import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  GoogleAuthData,
  UpdateProfileData,
} from "@/types/user";

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login with email and password
   * POST /auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/login", credentials, {
      skipAuth: true,
    });
  },

  /**
   * Register new user account
   * POST /auth/register
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/register", data, {
      skipAuth: true,
    });
  },

  /**
   * Authenticate with Google OAuth
   * POST /auth/google
   */
  googleAuth: async (data: GoogleAuthData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/google", data, {
      skipAuth: true,
    });
  },

  /**
   * Get authenticated user profile
   * GET /auth/profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>("/auth/profile");
  },

  /**
   * Update authenticated user profile
   * PUT /auth/profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    // Check if avatar file is included
    if (data.avatar) {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.email) formData.append("email", data.email);
      if (data.password) formData.append("password", data.password);
      if (data.password_confirmation)
        formData.append("password_confirmation", data.password_confirmation);
      formData.append("avatar", data.avatar);

      return apiClient.putFormData<User>("/auth/profile", formData);
    }

    // No file upload, use JSON
    return apiClient.put<User>("/auth/profile", data);
  },

  /**
   * Logout and revoke current access token
   * POST /auth/logout
   */
  logout: async (): Promise<null> => {
    return apiClient.post<null>("/auth/logout");
  },
};
