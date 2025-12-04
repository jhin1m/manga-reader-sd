# Internationalization (i18n) Guide

**⚠️ CRITICAL - MANDATORY reading for ALL developers**

**All user-facing text MUST use translations - NO exceptions!**

---

## Table of Contents

- [The Mandatory Rule](#the-mandatory-rule)
- [next-intl Setup](#next-intl-setup)
- [Basic Usage](#basic-usage)
- [Namespace Organization](#namespace-organization)
- [Multiple Namespaces](#multiple-namespaces)
- [Interpolation & Variables](#interpolation--variables)
- [Formatting](#formatting)
- [Files with Violations](#files-with-violations)
- [Examples (Good vs Bad)](#examples-good-vs-bad)

---

## The Mandatory Rule

### ⚠️ CRITICAL RULE

**ALL user-facing text MUST use `useTranslations()`**

**NO hardcoded strings allowed - EVER**

This applies to:

- Button labels
- Form labels and placeholders
- Page titles and headings
- Error messages
- Success messages
- Tooltips and help text
- Navigation links
- Any text visible to users

### Why This Matters

1. **Future internationalization** - Easy to add English or other languages
2. **Consistency** - Centralized text management
3. **Maintainability** - Update text in one place
4. **Professional** - Industry best practice

---

## next-intl Setup

### Configuration

**Default locale**: Vietnamese (`vi`)

**Structure:**

```
messages/
└── vi.json         # Vietnamese translations

i18n/
└── request.ts      # next-intl config

i18n.ts             # Main config file
next.config.ts      # withNextIntl plugin
```

**Current config (`i18n.ts`):**

```typescript
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["vi"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

### Adding Additional Locales

To add English (en):

1. Create `messages/en.json`
2. Update `i18n.ts`:

   ```typescript
   const locales = ["vi", "en"];
   ```

3. Add locale switcher in UI

---

## Basic Usage

### In Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export function Component() {
  const t = useTranslations("namespace");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <button>{t("action")}</button>
    </div>
  );
}
```

### In Server Components

```tsx
import { useTranslations } from "next-intl";

export default async function Page() {
  const t = await useTranslations("namespace");

  return <h1>{t("title")}</h1>;
}
```

### Simple Example

**Translation file (`messages/vi.json`):**

```json
{
  "homepage": {
    "title": "Chào mừng đến với Manga Reader",
    "description": "Đọc manga yêu thích của bạn miễn phí"
  }
}
```

**Component:**

```tsx
"use client";

import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("homepage");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

---

## Namespace Organization

### Structure in `messages/vi.json`

Organize by feature/page:

```json
{
  "common": {
    "save": "Lưu",
    "cancel": "Hủy",
    "delete": "Xóa",
    "edit": "Chỉnh sửa",
    "search": "Tìm kiếm",
    "loading": "Đang tải...",
    "error": "Đã xảy ra lỗi"
  },

  "navigation": {
    "home": "Trang chủ",
    "genres": "Thể loại",
    "ranking": "Xếp hạng",
    "library": "Thư viện",
    "profile": "Trang cá nhân"
  },

  "auth": {
    "login": {
      "title": "Đăng nhập",
      "emailLabel": "Email",
      "emailPlaceholder": "you@example.com",
      "passwordLabel": "Mật khẩu",
      "submit": "Đăng nhập",
      "submitting": "Đang đăng nhập...",
      "success": "Đăng nhập thành công!",
      "error": "Đăng nhập thất bại"
    },
    "register": {
      "title": "Đăng ký",
      "nameLabel": "Tên",
      "emailLabel": "Email",
      "passwordLabel": "Mật khẩu",
      "confirmPasswordLabel": "Xác nhận mật khẩu",
      "submit": "Đăng ký",
      "success": "Đăng ký thành công!",
      "hasAccount": "Đã có tài khoản?",
      "loginLink": "Đăng nhập ngay"
    }
  },

  "manga": {
    "status": {
      "ongoing": "Đang ra",
      "completed": "Hoàn thành",
      "hiatus": "Tạm ngưng"
    },
    "detail": {
      "title": "Thông tin truyện",
      "author": "Tác giả",
      "genres": "Thể loại",
      "description": "Mô tả",
      "chapters": "Danh sách chương",
      "readNow": "Đọc ngay",
      "bookmark": "Đánh dấu",
      "bookmarked": "Đã đánh dấu"
    }
  },

  "homepage": {
    "hero": {
      "title": "Khám phá thế giới Manga",
      "description": "Hàng nghìn bộ truyện tranh đang chờ bạn",
      "exploreNow": "Khám phá ngay"
    },
    "sections": {
      "recent": "Truyện mới cập nhật",
      "hot": "Truyện hot",
      "viewAll": "Xem tất cả"
    }
  },

  "errors": {
    "loadError": "Không thể tải dữ liệu",
    "notFound": "Không tìm thấy",
    "unauthorized": "Vui lòng đăng nhập",
    "serverError": "Lỗi máy chủ",
    "networkError": "Lỗi kết nối mạng"
  }
}
```

### Namespace Naming Conventions

- **Feature-based**: `auth`, `manga`, `user`, `comment`
- **Page-based**: `homepage`, `searchPage`, `profilePage`
- **Shared**: `common`, `navigation`, `errors`
- **Nested**: Use dot notation in JSON

---

## Multiple Namespaces

### Using Multiple Namespaces in One Component

```tsx
"use client";

import { useTranslations } from "next-intl";

export function MangaDetail() {
  const t = useTranslations("manga.detail");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>

      <button>{tCommon("save")}</button>
      <button>{tCommon("cancel")}</button>

      {error && <div className="error">{tErrors("loadError")}</div>}
    </div>
  );
}
```

### Best Practices

- **Common actions**: Use `common` namespace
- **Feature-specific**: Use feature namespace
- **Consistent naming**: Same key across namespaces where applicable

---

## Interpolation & Variables

### Basic Interpolation

**Translation:**

```json
{
  "welcome": "Xin chào, {name}!",
  "chapters": "Có {count} chương"
}
```

**Usage:**

```tsx
const t = useTranslations('namespace')

<p>{t('welcome', { name: user.name })}</p>
<p>{t('chapters', { count: manga.chapters.length })}</p>
```

### Rich Text / HTML

**Translation:**

```json
{
  "terms": "Bằng cách đăng ký, bạn đồng ý với <link>Điều khoản sử dụng</link>"
}
```

**Usage:**

```tsx
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const t = useTranslations('auth.register')

<p>
  {t.rich('terms', {
    link: (chunks) => (
      <Link href="/terms" className="text-primary underline">
        {chunks}
      </Link>
    )
  })}
</p>
```

### Pluralization

**Translation:**

```json
{
  "comments": {
    "count": "{count, plural, =0 {Chưa có bình luận} =1 {1 bình luận} other {# bình luận}}"
  }
}
```

**Usage:**

```tsx
<p>{t("comments.count", { count: commentCount })}</p>
```

---

## Formatting

### Date & Time

```tsx
import { useFormatter } from "next-intl";

export function Component() {
  const format = useFormatter();

  const createdAt = new Date("2025-01-15");

  return (
    <div>
      <p>
        {format.dateTime(createdAt, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      {/* Output: 15 Tháng 1, 2025 */}
    </div>
  );
}
```

### Numbers

```tsx
import { useFormatter } from "next-intl";

export function Stats() {
  const format = useFormatter();

  return (
    <div>
      <p>Views: {format.number(1234567)}</p>
      {/* Output: 1.234.567 (Vietnamese format) */}
    </div>
  );
}
```

---

## Files with Violations

### ⚠️ These Files Need Refactoring

**Files with hardcoded text (MUST FIX):**

1. **`components/auth/login-form.tsx`** - Hardcoded English
   - "Email", "Password", "Login", etc.
   - Status: ❌ Needs i18n implementation

2. **`components/auth/register-form.tsx`** - Hardcoded English
   - "Name", "Email", "Password", "Register", etc.
   - Status: ❌ Needs i18n implementation

3. **`components/layout/header/navbar.tsx`** - Hardcoded English
   - "Home", "Genres", "Search", etc.
   - Status: ❌ Needs i18n implementation

4. **`components/layout/footer.tsx`** - Hardcoded English/Vietnamese mix
   - Status: ❌ Needs i18n implementation

5. **`components/layout/header/user-menu.tsx`** - Hardcoded text + TODO comment
   - "Profile", "Library", "Logout", etc.
   - Status: ❌ Needs i18n implementation

### ✅ Recently Fixed (Phase 7)

**Profile components have been fixed:**

1. **`components/user/EditProfileForm.tsx`** - ✅ Fixed
   - Updated namespace from "profile" to "user.profile"
   - Added form placeholders and validation translations
   - Status: ✅ Complete i18n implementation

2. **`components/user/ChangePasswordForm.tsx`** - ✅ Fixed
   - Updated namespace from "profile" to "user.profile"
   - Added password form translations
   - Status: ✅ Complete i18n implementation

3. **`components/user/AvatarUpload.tsx`** - ✅ Fixed
   - Updated namespace from "profile" to "user.profile"
   - Added avatar upload translations
   - Status: ✅ Complete i18n implementation

4. **`app/(user)/profile/page.tsx`** - ✅ Fixed
   - Updated namespace from "profile" to "user.profile"
   - Status: ✅ Complete i18n implementation

5. **`app/(user)/profile/edit/page.tsx`** - ✅ Fixed
   - Updated namespace from "profile" to "user.profile"
   - Status: ✅ Complete i18n implementation

### ✅ Good Reference

**`app/home-content.tsx`** - ✅ Correct i18n usage

- Uses `useTranslations()` for all text
- Multiple namespaces (`homepage`, `navigation`)
- Proper interpolation
- Status: ✅ Follow this pattern

---

## Examples (Good vs Bad)

### ❌ FORBIDDEN - Hardcoded Text

```tsx
// ❌ WRONG - Hardcoded English
export function LoginForm() {
  return (
    <div>
      <h1>Sign in</h1>
      <p>Don't have an account?</p>
      <input placeholder="Email" />
      <button>Login</button>
    </div>
  );
}

// ❌ WRONG - Hardcoded Vietnamese
export function LoginForm() {
  return (
    <div>
      <h1>Đăng nhập</h1>
      <p>Chưa có tài khoản?</p>
      <input placeholder="Email" />
      <button>Đăng nhập</button>
    </div>
  );
}

// ❌ WRONG - Mixed hardcoded text
export function Component() {
  const errorMessage = "An error occurred";
  return <div>{errorMessage}</div>;
}
```

### Password Change Translations

**When implementing password change functionality, use these translation keys:**

```json
// messages/vi.json - Add to auth namespace
{
  "auth": {
    "changePassword": {
      "title": "Đổi mật khẩu",
      "currentPassword": "Mật khẩu hiện tại",
      "newPassword": "Mật khẩu mới",
      "confirmPassword": "Xác nhận mật khẩu mới",
      "submit": "Đổi mật khẩu",
      "success": "Đổi mật khẩu thành công",
      "error": "Đổi mật khẩu thất bại",
      "invalidCurrent": "Mật khẩu hiện tại không chính xác",
      "passwordMismatch": "Mật khẩu xác nhận không khớp",
      "minLength": "Mật khẩu phải có ít nhất 6 ký tự"
    }
  }
}
```

**Usage in password change component:**

```tsx
// ✅ CORRECT - Password change with i18n
"use client";
import { useTranslations } from "next-intl";

export function ChangePasswordForm() {
  const t = useTranslations("auth.changePassword");

  return (
    <div>
      <h1>{t("title")}</h1>

      <input
        type="password"
        placeholder={t("currentPassword")}
        name="current_password"
        required
      />

      <input
        type="password"
        placeholder={t("newPassword")}
        name="password"
        required
        minLength={6}
      />

      <input
        type="password"
        placeholder={t("confirmPassword")}
        name="password_confirmation"
        required
      />

      <button type="submit">{t("submit")}</button>
    </div>
  );
}
```

**Important notes for password change:**

- Always include `currentPassword` field for UX security
- Use descriptive error messages via translations
- Show success feedback after password change
- Update auth state after successful change
- Consider logging user out and requiring re-login for security

### ✅ CORRECT - Using Translations

```tsx
// ✅ CORRECT - All text translated
"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const t = useTranslations("auth.login");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("noAccount")}</p>
      <Input placeholder={t("emailPlaceholder")} />
      <Button>{t("submit")}</Button>
    </div>
  );
}

// ✅ CORRECT - Error messages translated
export function Component() {
  const t = useTranslations("errors");

  if (error) {
    return <div>{t("loadError")}</div>;
  }

  return <div>Content</div>;
}
```

### Real-World Example

**From `app/home-content.tsx` (✅ GOOD):**

```tsx
"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export function HomePageContent() {
  const t = useTranslations("homepage");
  const tNav = useTranslations("navigation");

  return (
    <section>
      <div>
        <h1>{t("hero.title")}</h1>
        <p>{t("hero.description")}</p>

        <div>
          <Link href="/search">{t("hero.exploreNow")}</Link>

          <Link href="/genres">{tNav("genres")}</Link>
        </div>
      </div>

      <section>
        <h2>{t("sections.recent")}</h2>
        {/* Content */}
      </section>

      <section>
        <h2>{t("sections.hot")}</h2>
        {/* Content */}
      </section>
    </section>
  );
}
```

---

## Best Practices

### 1. Always Use Translations

```tsx
// ✅ CORRECT
const t = useTranslations('namespace')
<button>{t('save')}</button>

// ❌ WRONG
<button>Save</button>
<button>Lưu</button>
```

### 2. Organize by Feature

```json
{
  "manga": {
    "detail": { ... },
    "list": { ... },
    "search": { ... }
  }
}
```

### 3. Use Common Namespace

```tsx
const tCommon = useTranslations('common')
<button>{tCommon('save')}</button>
<button>{tCommon('cancel')}</button>
```

### 4. Descriptive Keys

```json
// ✅ GOOD - Clear and descriptive
{
  "loginButton": "Đăng nhập",
  "emailPlaceholder": "Nhập email của bạn",
  "passwordRequired": "Vui lòng nhập mật khẩu"
}

// ❌ BAD - Vague keys
{
  "btn1": "Đăng nhập",
  "input1": "Nhập email",
  "err1": "Lỗi"
}
```

### 5. Consistent Naming

Use same keys across namespaces where applicable:

```json
{
  "manga": {
    "save": "Lưu truyện",
    "cancel": "Hủy"
  },
  "comment": {
    "save": "Lưu bình luận",
    "cancel": "Hủy"
  },
  "common": {
    "save": "Lưu",
    "cancel": "Hủy"
  }
}
```

---

## SSR Compatibility

### ⚠️ Critical for i18n Components

When using translations, ensure components are SSR-compatible:

### Common SSR Issues

1. **Browser APIs on Server**
   - `window`, `document`, `localStorage` cause crashes
   - Use Next.js navigation primitives instead

2. **Location Handling**

   ```tsx
   // ❌ WRONG - Browser-only API
   const router = useRouter();
   const pathname = window.location.pathname;

   // ✅ CORRECT - Next.js primitives
   const router = useRouter();
   const pathname = usePathname();
   ```

3. **localStorage Access**

   ```tsx
   // ❌ WRONG - Crashes on SSR
   const token = localStorage.getItem("token");

   // ✅ CORRECT - SSR-safe wrapper
   const token =
     typeof window !== "undefined" ? localStorage.getItem("token") : null;
   ```

### SSR-Safe Patterns

1. **Dynamic Imports for Client-Only Code**

   ```tsx
   "use client";

   import dynamic from "next/dynamic";

   const ClientOnlyComponent = dynamic(
     () => import("./ComponentUsingBrowserAPIs"),
     { ssr: false }
   );
   ```

2. **Conditional Rendering**

   ```tsx
   "use client";

   export function Component() {
     const [isClient, setIsClient] = useState(false);

     useEffect(() => {
       setIsClient(true);
     }, []);

     if (!isClient) {
       return <div>Loading...</div>;
     }

     // Client-only content here
   }
   ```

### Testing SSR Compatibility

Always test components with:

- Server rendering (`next build && next start`)
- Static generation (`next build && next export`)
- Hydration mismatches in browser console

---

## Common Translation Mistakes

### 1. Wrong Namespace Paths

```tsx
// ❌ WRONG - Incorrect namespace
const t = useTranslations("profile");

// ✅ CORRECT - Use user namespace
const t = useTranslations("user.profile");
```

### 2. Missing Translation Keys

```tsx
// ❌ WRONG - Key doesn't exist
<button>{t("submit")}</button>

// ✅ CORRECT - Key exists in vi.json
<button>{t("saveChanges")}</button>
```

### 3. Hardcoded Placeholders

```tsx
// ❌ WRONG - Hardcoded placeholder
<input placeholder="Enter your email" />

// ✅ CORRECT - Translated placeholder
<input placeholder={t("emailPlaceholder")} />
```

### 4. Direct String Concatenation

```tsx
// ❌ WRONG - Direct concatenation
<p>{t("welcome")} {user.name}</p>

// ✅ CORRECT - Using interpolation
<p>{t("welcome", { name: user.name })}</p>
```

---

## Translation Keys Best Practices

### Naming Conventions

1. **Buttons**: Use action-based names
   - `"saveChanges"`, `"cancel"`, `"delete"`, `"upload"`

2. **Placeholders**: Use `Placeholder` suffix
   - `"emailPlaceholder"`, `"namePlaceholder"`, `"searchPlaceholder"`

3. **Labels**: Use descriptive names
   - `"emailLabel"`, `"passwordLabel"`, `"avatarLabel"`

4. **Validation**: Use descriptive error names
   - `"emailInvalid"`, `"passwordMinLength"`, `"fileSizeExceeded"`

5. **Status Messages**: Use success/error suffixes
   - `"avatarUploadSuccess"`, `"loginFailed"`, `"passwordUpdateFailed"`

### Organization

```json
{
  "feature": {
    "action": "Text",
    "form": {
      "fieldPlaceholder": "Placeholder text",
      "fieldLabel": "Label text",
      "validationError": "Error message"
    },
    "messages": {
      "success": "Success message",
      "error": "Error message"
    }
  }
}
```

---

## Pre-Commit Checklist

Before committing ANY code:

- [ ] NO hardcoded strings in JSX
- [ ] All buttons use `t('key')`
- [ ] All form labels use `t('key')`
- [ ] All placeholders use `t('key')`
- [ ] All error messages use `t('key')`
- [ ] Imported `useTranslations` from `'next-intl'`
- [ ] Added translations to `messages/vi.json`

---

## Related Guides

- **[Component Patterns](./02-COMPONENT-PATTERNS.md)** - Using translations in components
- **[Forms & Validation](./05-FORMS-VALIDATION.md)** - Translating form fields
- **[Pre-commit Checklist](../references/CHECKLIST.md)** - Full verification list

---

## Reference Files

**✅ Good examples:**

- `app/home-content.tsx` - Correct i18n usage with multiple namespaces
- `messages/vi.json` - Current translation structure

**❌ Files needing fixes:**

- `components/auth/login-form.tsx`
- `components/auth/register-form.tsx`
- `components/layout/header/navbar.tsx`
- `components/layout/footer.tsx`
- `components/layout/header/user-menu.tsx`

See [Anti-Patterns Reference](../references/ANTI-PATTERNS.md) for detailed issues.

---

**Last updated**: 2025-12-04
