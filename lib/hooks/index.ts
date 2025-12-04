/**
 * Hooks Index
 * Re-export all custom hooks for easier imports
 */

export {
  useAuth,
  useLogin,
  useLogout,
  useRegister,
  useGoogleAuth,
} from "./use-auth";

export {
  useUpdateProfile,
  useUploadAvatar,
  useUpdatePassword,
} from "./use-profile";

export { useTokenRefresh } from "./use-token-refresh";
