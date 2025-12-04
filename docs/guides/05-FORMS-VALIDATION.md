# Forms & Validation

**Building type-safe forms with React Hook Form and Zod**

**Prerequisites:**

- [State Management](./03-STATE-MANAGEMENT.md) - Understanding form state
- [UI Components](./08-UI-COMPONENTS.md) - shadcn/ui Form components

---

## Table of Contents

- [Three-Step Pattern](#three-step-pattern)
- [Creating Zod Schemas](#creating-zod-schemas)
- [Using React Hook Form](#using-react-hook-form)
- [Form UI with shadcn/ui](#form-ui-with-shadcnui)
- [Common Validation Patterns](#common-validation-patterns)
- [Error Handling](#error-handling)

---

## Three-Step Pattern

### The Standard Flow

1. **Define Zod schema** in `lib/validators/`
2. **Create form with React Hook Form** using zodResolver
3. **Build UI** with shadcn/ui Form components

---

## Creating Zod Schemas

### Location

`lib/validators/[feature].ts`

```
lib/validators/
├── auth.ts         # Login, register schemas
├── user-schemas.ts # User profile & password schemas
├── manga.ts        # Manga-related forms
├── comment.ts      # Comment form schema
└── ...
```

### Basic Schema Pattern

**`lib/validators/auth.ts`:**

```typescript
import { z } from "zod";

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Type inference from schema
export type LoginFormData = z.infer<typeof loginSchema>;
```

### Register Schema Example

```typescript
/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

### User Profile Schemas (Phase 2)

**`lib/validators/user-schemas.ts`:**

```typescript
import { z } from "zod";
import type { UpdateProfileData } from "@/types/user";

/**
 * Common validation rules
 */
const nameValidation = z
  .string()
  .min(2, "user.profile.nameMinChars")
  .max(50, "user.profile.nameMaxChars")
  .trim();

const emailValidation = z.string().email("user.profile.emailInvalid");

const passwordValidation = z
  .string()
  .min(6, "user.profile.passwordMinLength")
  .max(100, "user.profile.passwordMaxLength")
  .transform((val) => val.trim());

/**
 * Update Profile Schema
 * Validates name, email, and avatar changes (password has separate schema)
 */
export const updateProfileSchema: z.ZodType<Partial<UpdateProfileData>> =
  z.object({
    name: nameValidation.optional().transform((val) => val || undefined),
    email: emailValidation.optional().transform((val) => val || undefined),
    avatar: z
      .instanceof(File, { message: "user.profile.avatarRequired" })
      .optional(),
  });

/**
 * Change Password Schema
 * Validates password change with confirmation matching
 */
export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "user.profile.currentPasswordRequired")
      .transform((val) => val.trim()),

    password: passwordValidation,

    password_confirmation: z
      .string()
      .min(1, "user.profile.passwordConfirmationRequired"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "user.profile.passwordMismatch",
    path: ["password_confirmation"], // Error appears on confirmation field
  });

/**
 * Avatar File Schema
 * Validates uploaded avatar file (size, type)
 *
 * Client enforces 5MB limit (more lenient)
 * API enforces 2MB limit (stricter)
 */
export const avatarFileSchema = z
  .instanceof(File, { message: "user.profile.fileRequired" })
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "user.profile.fileSizeExceeded"
  )
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.type
      ),
    "user.profile.fileTypeInvalid"
  );

// Type inference from schemas
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AvatarFileInput = z.infer<typeof avatarFileSchema>;
```

#### Key Points for User Profile Schemas:

1. **Translation Keys**: All error messages use i18n keys (`user.profile.*`)
2. **Type Safety**: Schemas infer from existing `UpdateProfileData` type
3. **Optional Fields**: Profile updates use `.optional()` for partial updates
4. **File Validation**: Separate schema for avatar uploads with size/type checks
5. **Security**: Password change requires current password confirmation

### Complex Schema with Nested Objects

```typescript
/**
 * Manga create/update schema
 */
export const mangaSchema = z.object({
  name: z.string().min(1, "Manga name is required").max(200, "Name too long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description too long"),

  author: z.string().min(1, "Author is required"),

  genres: z
    .array(z.string())
    .min(1, "Select at least one genre")
    .max(5, "Maximum 5 genres allowed"),

  status: z.enum(["ongoing", "completed", "hiatus"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),

  coverImage: z
    .instanceof(File, { message: "Cover image is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "Only JPEG, PNG, or WebP allowed" }
    ),
});

export type MangaFormData = z.infer<typeof mangaSchema>;
```

---

## Using React Hook Form

### Basic Setup

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    // data is fully typed and validated
    console.log(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
  );
}
```

### With React Query Mutation

```tsx
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/store/authStore";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setAuth(response.user, response.token);
      toast.success("Login successful!");
      router.push("/");
    },
    onError: (error) => {
      toast.error("Login failed", {
        description: error.response?.data?.message || "Invalid credentials",
      });
    },
  });

  async function onSubmit(data: LoginFormData) {
    mutation.mutate(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

---

## Form UI with shadcn/ui

### Standard Form Field

```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="you@example.com" {...field} />
          </FormControl>
          <FormDescription>We'll never share your email</FormDescription>
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

    <button type="submit">Submit</button>
  </form>
</Form>;
```

### With Translations (MANDATORY)

```tsx
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");

  // ... form setup

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t("submitting") : t("submit")}
        </Button>
      </form>
    </Form>
  );
}
```

### Translating Validation Error Messages

**CRITICAL**: All validation error messages MUST use i18n keys, not hardcoded text.

**Schema with Translation Keys:**

```typescript
// ❌ WRONG - Hardcoded error messages
export const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

// ✅ CORRECT - Using i18n keys
export const schema = z.object({
  name: z.string().min(2, "user.profile.nameMinChars"),
  email: z.string().email("user.profile.emailInvalid"),
});
```

**Translation File Structure (`messages/vi.json`):**

```json
{
  "user": {
    "profile": {
      "nameMinChars": "Tên tối thiểu 2 ký tự",
      "nameMaxChars": "Tên tối đa 50 ký tự",
      "emailInvalid": "Email không hợp lệ",
      "passwordMinLength": "Mật khẩu mới tối thiểu 6 ký tự",
      "passwordMaxLength": "Mật khẩu quá dài",
      "currentPasswordRequired": "Vui lòng nhập mật khẩu hiện tại",
      "passwordConfirmationRequired": "Vui lòng xác nhận mật khẩu",
      "passwordMismatch": "Mật khẩu xác nhận không khớp",
      "fileRequired": "Vui lòng chọn một file",
      "fileSizeExceeded": "Kích thước file tối đa 5MB",
      "fileTypeInvalid": "Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)",
      "avatarRequired": "Vui lòng chọn avatar"
    }
  }
}
```

**Form Component with Error Translation:**

```tsx
import { useTranslations } from "next-intl";

// Helper function to translate error messages
function getErrorMessage(error: string, t: (key: string) => string) {
  // If it's an i18n key (contains dot), translate it
  if (error.includes(".")) {
    return t(error);
  }
  // Fallback for any hardcoded messages (shouldn't exist)
  return error;
}

export function ProfileForm() {
  const t = useTranslations("user.profile");

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("nameLabel")}</FormLabel>
            <FormControl>
              <Input placeholder={t("namePlaceholder")} {...field} />
            </FormControl>
            <FormMessage>
              {({ message }) => (message ? getErrorMessage(message, t) : null)}
            </FormMessage>
          </FormItem>
        )}
      />
    </Form>
  );
}
```

### Select Field

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{t("status")}</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={t("selectStatus")} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="ongoing">{t("status.ongoing")}</SelectItem>
          <SelectItem value="completed">{t("status.completed")}</SelectItem>
          <SelectItem value="hiatus">{t("status.hiatus")}</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>;
```

### Textarea Field

```tsx
import { Textarea } from "@/components/ui/textarea";

<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{t("description")}</FormLabel>
      <FormControl>
        <Textarea
          placeholder={t("descriptionPlaceholder")}
          className="min-h-32"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

### Checkbox Field

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<FormField
  control={form.control}
  name="terms"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <FormLabel className="cursor-pointer">{t("agreeToTerms")}</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>;
```

---

## Common Validation Patterns

### Email Validation

```typescript
email: z.string().min(1, "Email is required").email("Invalid email address");
```

### Password Validation

```typescript
// Basic
password: z.string().min(8, "Password must be at least 8 characters");

// Strong password
password: z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain uppercase, lowercase, number, and special character"
  );
```

### Confirm Password

```typescript
export const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

### URL Validation

```typescript
website: z.string().url("Invalid URL").optional().or(z.literal(""));
```

### Number Range

```typescript
age: z.number()
  .min(13, "Must be at least 13 years old")
  .max(120, "Invalid age");

rating: z.number().min(1).max(5);
```

### Array Validation

```typescript
genres: z.array(z.string())
  .min(1, "Select at least one genre")
  .max(5, "Maximum 5 genres");
```

### File Validation

```typescript
avatar: z.instanceof(File)
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "File must be less than 2MB",
  })
  .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
    message: "Only JPEG or PNG allowed",
  });
```

### Optional Fields

```typescript
// Method 1: optional()
bio: z.string().max(500).optional();

// Method 2: or(z.literal(''))
bio: z.string().max(500).or(z.literal(""));

// Method 3: nullish
bio: z.string().max(500).nullish();
```

### Custom Validation

```typescript
username: z.string()
  .min(3)
  .refine((username) => /^[a-zA-Z0-9_]+$/.test(username), {
    message: "Username can only contain letters, numbers, and underscores",
  })
  .refine(
    async (username) => {
      // API call to check availability
      const available = await checkUsernameAvailable(username);
      return available;
    },
    { message: "Username already taken" }
  );
```

---

## Error Handling

### Validation Errors

Automatically displayed by `<FormMessage />`:

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage /> {/* Shows validation errors */}
    </FormItem>
  )}
/>
```

### Manual Form Errors

```tsx
// Set field error
form.setError("email", {
  type: "manual",
  message: "Email already exists",
});

// Set root error (not tied to specific field)
form.setError("root", {
  type: "manual",
  message: "Something went wrong",
});

// Display root error
{
  form.formState.errors.root && (
    <div className="text-red-500">{form.formState.errors.root.message}</div>
  );
}
```

### API Error Handling

```tsx
const mutation = useMutation({
  mutationFn: authApi.register,
  onSuccess: () => {
    toast.success("Registration successful!");
    router.push("/login");
  },
  onError: (error) => {
    // Handle field-specific errors from API
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(
        ([field, messages]) => {
          form.setError(field as keyof RegisterFormData, {
            type: "manual",
            message: messages[0],
          });
        }
      );
    } else {
      toast.error("Registration failed", {
        description: error.response?.data?.message || "Please try again",
      });
    }
  },
});
```

---

## Complete Form Example

**`components/auth/register-form.tsx`:**

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { registerSchema, type RegisterFormData } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/endpoints/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success(t("success"));
      router.push("/login");
    },
    onError: (error) => {
      toast.error(t("error"), {
        description: error.response?.data?.message,
      });
    },
  });

  async function onSubmit(data: RegisterFormData) {
    mutation.mutate(data);
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nameLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("namePlaceholder")} {...field} />
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
                <FormLabel>{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
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
                <FormLabel>{t("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? t("submitting") : t("submit")}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-primary hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
```

---

## Phase 3 & 4 Integration

### Using Validation Schemas in Custom Hooks (Phase 3)

The validation schemas created in Phase 2 will be used in Phase 3 to create custom hooks for form management:

**Example: `lib/hooks/use-update-profile.ts`**

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validators/user-schemas";
import { userApi } from "@/lib/api/endpoints/user";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useUpdateProfile() {
  const t = useTranslations("user.profile");

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      toast.success(t("updateSuccess"));
      form.reset();
    },
    onError: (error) => {
      toast.error(t("updateError"), {
        description: error.response?.data?.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
}
```

### Using Hooks in UI Components (Phase 4)

Phase 4 UI components will consume the hooks from Phase 3:

**Example: `components/user/profile/update-profile-form.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useUpdateProfile } from "@/lib/hooks/use-update-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export function UpdateProfileForm() {
  const t = useTranslations("user.profile");
  const { form, onSubmit, isPending } = useUpdateProfile();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nameLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("namePlaceholder")} {...field} />
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
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t("saving") : t("save")}
        </Button>
      </form>
    </Form>
  );
}
```

### Password Change Hook (Phase 3)

**`lib/hooks/use-change-password.ts`**

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validators/user-schemas";
import { userApi } from "@/lib/api/endpoints/user";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useChangePassword() {
  const t = useTranslations("user.profile");

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      toast.success(t("passwordChanged"));
      form.reset();
    },
    onError: (error) => {
      toast.error(t("passwordChangeError"), {
        description: error.response?.data?.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
}
```

## Custom Hooks for Form Operations (Phase 3)

### Architecture Overview

Phase 3 introduces custom hooks that bridge Phase 2 validation schemas with Phase 4 UI components. Each hook:

1. **Validates data** using Phase 2 Zod schemas
2. **Calls API** through the endpoint layer
3. **Manages state** (loading, error, success)
4. **Syncs with auth store** when user data changes
5. **Returns standardized response** `{ success, data?, error? }`

### Location

`lib/hooks/use-profile.ts` - Contains all profile-related hooks

```
lib/hooks/
├── index.ts           # Export barrel
├── use-auth.ts        # Auth hooks (login, register, logout)
├── use-profile.ts     # Profile hooks (Phase 3) - NEW
└── use-token-refresh.ts # Token refresh logic
```

### Profile Update Hook

**`lib/hooks/use-profile.ts` - useUpdateProfile**

```typescript
/**
 * Hook to update user profile (name, email)
 * Syncs with auth store on success
 */
export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateUser = useAuthStore((state) => state.updateUser);

  const updateProfile = useCallback(
    async (data: { name?: string; email?: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Validate input (Phase 2 schema)
        const validated = updateProfileSchema.parse(data);

        // 2. Call API
        const updatedUser = await authApi.updateProfile(validated);

        // 3. Sync auth store
        updateUser(updatedUser);

        return { success: true, data: updatedUser };
      } catch (err) {
        // 4. Sanitize error messages
        const errorMessage = "user.profile.updateFailed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [updateUser]
  );

  return { updateProfile, isLoading, error };
}
```

### Avatar Upload Hook

**`lib/hooks/use-profile.ts` - useUploadAvatar**

```typescript
/**
 * Hook to upload user avatar
 * Syncs with auth store on success
 */
export function useUploadAvatar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateUser = useAuthStore((state) => state.updateUser);

  const uploadAvatar = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Validate file (Phase 2 schema)
        avatarFileSchema.parse(file);

        // 2. Call API with multipart/form-data
        const updatedUser = await authApi.updateProfile({ avatar: file });

        // 3. Sync auth store (new avatar_full_url)
        updateUser(updatedUser);

        return { success: true, data: updatedUser };
      } catch (err) {
        // 4. Sanitize error messages
        const errorMessage = "user.profile.avatarUploadFailed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [updateUser]
  );

  return { uploadAvatar, isLoading, error };
}
```

### Password Update Hook

**`lib/hooks/use-profile.ts` - useUpdatePassword**

```typescript
/**
 * Hook to update user password
 * Note: Backend doesn't verify current_password, but we validate client-side
 */
export function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePassword = useCallback(async (data: ChangePasswordData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Validate input (Phase 2 schema)
      const validated = changePasswordSchema.parse(data);

      // 2. Call API (only send new password fields)
      await authApi.updateProfile({
        password: validated.password,
        password_confirmation: validated.password_confirmation,
      });

      // 3. No user data changes (only password hash on backend)
      return { success: true };
    } catch (err) {
      // 4. Sanitize error messages
      const errorMessage = "user.profile.passwordUpdateFailed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updatePassword, isLoading, error };
}
```

### Using Hooks in Components (Phase 4)

**Profile Update Form Example:**

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useUpdateProfile } from "@/lib/hooks/use-profile";
import { updateProfileSchema } from "@/lib/validators/user-schemas";
import { toast } from "sonner";

export function UpdateProfileForm() {
  const t = useTranslations();
  const { updateProfile, isLoading, error } = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data) => {
    const result = await updateProfile(data);

    if (result.success) {
      toast.success(t("notifications.profileUpdated"));
    } else {
      toast.error(t(result.error));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields with shadcn/ui components */}
      {/* Error display with translated messages */}
    </form>
  );
}
```

### Error Handling Pattern

All hooks follow a consistent error handling pattern:

```typescript
try {
  // API call
  return { success: true, data };
} catch (err) {
  // Don't expose raw API errors
  // Return i18n keys instead
  setError("user.profile.someError");
  return { success: false, error: "user.profile.someError" };
}
```

This ensures:

- Consistent error messages across the app
- Easy translation of errors
- No implementation details leaked to UI
- Better UX with sanitized messages

---

## Best Practices

1. **Always use Zod schemas** - Don't write manual validation
2. **Type-safe forms** - Infer types from schemas with `z.infer`
3. **Translate all text** - Use `useTranslations()` for labels, errors, placeholders
4. **Use i18n keys in schemas** - Error messages should be translation keys (`user.profile.*`)
5. **Handle loading states** - Disable submit button when pending
6. **Provide feedback** - Use toast notifications for success/error
7. **Reset on success** - `form.reset()` after successful submission
8. **Server-side validation** - Always validate on backend too
9. **Separate concerns** - Schemas (Phase 2) → Hooks (Phase 3) → UI (Phase 4)

---

## Related Guides

- **[i18n Guide](./06-I18N-GUIDE.md)** - Translating form labels and errors
- **[UI Components](./08-UI-COMPONENTS.md)** - Using shadcn/ui Form components
- **[API Integration](./04-API-INTEGRATION.md)** - Using mutations with forms
- **[State Management](./03-STATE-MANAGEMENT.md)** - Form state patterns

---

## Reference Files

- `lib/validators/auth.ts` - Auth validation schemas
- `lib/validators/user-schemas.ts` - User profile & password validation schemas (Phase 2)
- `lib/hooks/use-profile.ts` - Custom hooks for profile operations (Phase 3) - NEW
- `components/auth/login-form.tsx` - Login form example (needs i18n fixes)
- `components/auth/register-form.tsx` - Register form example (needs i18n fixes)

---

**Last updated**: 2025-11-15
