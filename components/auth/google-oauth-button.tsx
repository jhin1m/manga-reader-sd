"use client";

/**
 * Google OAuth Button Component
 * Handles Google Sign-In with OAuth 2.0
 */

import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface GoogleOAuthButtonProps {
  onSuccess?: () => void;
  disabled?: boolean;
}

export function GoogleOAuthButton({
  onSuccess,
  disabled = false,
}: GoogleOAuthButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { googleAuth, isLoading } = useGoogleAuth();
  const t = useTranslations();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Call our backend API with Google access token
        const result = await googleAuth({
          access_token: tokenResponse.access_token,
        });

        if (result.success) {
          toast.success(t("auth.googleAuthSuccess"));

          // Redirect to previous page or homepage
          const redirectTo = searchParams.get("redirect") || "/";
          router.push(redirectTo);

          onSuccess?.();
        } else {
          toast.error(result.error || t("auth.googleAuthFailed"));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to authenticate";
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      toast.error(t("auth.failedToSignInWithGoogle"));
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => login()}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Spinner className="mr-2 h-4 w-4" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      {t("auth.continueWithGoogle")}
    </Button>
  );
}
