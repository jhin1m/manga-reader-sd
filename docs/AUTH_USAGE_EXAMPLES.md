# Authentication System - Usage Examples

This document provides comprehensive examples of how to use the authentication system in the Manga Reader application.

## Table of Contents

1. [Setup](#setup)
2. [Using Auth Hooks](#using-auth-hooks)
3. [Login Example](#login-example)
4. [Register Example](#register-example)
5. [Google OAuth Example](#google-oauth-example)
6. [Protected Routes](#protected-routes)
7. [User Profile Display](#user-profile-display)
8. [Logout Example](#logout-example)

---

## Setup

### 1. Wrap your app with AuthProvider

Add the `AuthProvider` to your root layout to enable token refresh:

```tsx
// app/layout.tsx
import { AuthProvider } from "@/lib/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
```

---

## Using Auth Hooks

### Available Hooks

```typescript
import {
  useAuth, // Get current auth state
  useLogin, // Login functionality
  useLogout, // Logout functionality
  useRegister, // Registration functionality
  useGoogleAuth, // Google OAuth functionality
} from "@/lib/hooks";
```

---

## Login Example

### Basic Login Form

```tsx
// app/(auth)/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const result = await login(values);

    if (result.success) {
      toast.success("Login successful!", {
        description: `Welcome back, ${result.data?.user.name}!`,
      });
      router.push("/");
    } else {
      toast.error("Login failed", {
        description: result.error,
      });
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
```

---

## Register Example

### Registration Form

```tsx
// app/(auth)/register/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const result = await register(values);

    if (result.success) {
      toast.success("Registration successful!", {
        description: `Welcome, ${result.data?.user.name}!`,
      });
      router.push("/");
    } else {
      toast.error("Registration failed", {
        description: result.error,
      });
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Register</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
```

---

## Google OAuth Example

### Google OAuth Button

```tsx
// components/auth/GoogleLoginButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useGoogleAuth } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GoogleLoginButton() {
  const router = useRouter();
  const { googleAuth, isLoading } = useGoogleAuth();

  const handleGoogleLogin = async () => {
    // This is a simplified example
    // In production, you would use Google's OAuth flow to get the access token
    // See: https://developers.google.com/identity/protocols/oauth2

    try {
      // Example: After getting token from Google OAuth flow
      const googleAccessToken = "ya29.a0AfH6SMBx7K3m..."; // From Google OAuth

      const result = await googleAuth({ access_token: googleAccessToken });

      if (result.success) {
        toast.success("Login successful!", {
          description: `Welcome, ${result.data?.user.name}!`,
        });
        router.push("/");
      } else {
        toast.error("Google login failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Google login error", {
        description: "Failed to authenticate with Google",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}
```

---

## Protected Routes

### Middleware for Protected Routes

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get auth token from cookies or headers
  const authStorage = request.cookies.get("auth-storage");

  let isAuthenticated = false;

  if (authStorage) {
    try {
      const authData = JSON.parse(authStorage.value);
      isAuthenticated = authData.state?.isAuthenticated || false;
    } catch {
      isAuthenticated = false;
    }
  }

  // Protected routes
  const protectedPaths = ["/profile", "/library", "/settings"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !isAuthenticated) {
    // Redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Guest-only routes (login, register)
  const guestPaths = ["/login", "/register"];
  const isGuestPath = guestPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isGuestPath && isAuthenticated) {
    // Redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/library/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
```

### Client-Side Protected Component

```tsx
// components/auth/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
```

---

## User Profile Display

### Display Current User Info

```tsx
// components/layout/UserMenu.tsx
"use client";

import { useAuth, useLogout } from "@/lib/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export function UserMenu() {
  const { user, isAuthenticated } = useAuth();
  const { logout, isLoading } = useLogout();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logged out successfully");
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user.avatar_full_url} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Points: {user.available_points}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/library">My Library</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
          {isLoading ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Logout Example

### Simple Logout Button

```tsx
// components/auth/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const { logout, isLoading } = useLogout();

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      toast.success("Logged out successfully");
      router.push("/login");
    } else {
      toast.error("Logout failed", {
        description: result.error,
      });
    }
  };

  return (
    <Button onClick={handleLogout} disabled={isLoading} variant="outline">
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
```

---

## Additional Features

### Check Authentication Status

```tsx
"use client";

import { useAuth } from "@/lib/hooks";

export function SomeComponent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login to continue</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Points: {user?.available_points}</p>
    </div>
  );
}
```

### Access Token for API Calls

The authentication hooks automatically handle token management. When you use the `apiClient`, it will automatically include the Bearer token in requests:

```tsx
import { apiClient } from "@/lib/api/client";

// Token is automatically added to the Authorization header
const manga = await apiClient.get("/mangas/one-piece");
```

---

## Summary

The authentication system provides:

1. ✅ **Zustand Store** - Centralized auth state with localStorage persistence
2. ✅ **Auth Hooks** - Easy-to-use hooks for login, register, logout
3. ✅ **Token Refresh** - Automatic token validation every 5 minutes
4. ✅ **Type Safety** - Full TypeScript support
5. ✅ **Error Handling** - Comprehensive error handling with user feedback
6. ✅ **Auto-logout** - Automatic logout on 401 errors

All authentication state is managed centrally and persists across page reloads!
