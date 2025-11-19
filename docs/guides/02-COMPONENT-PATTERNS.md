# Component Patterns

**Standard patterns for writing React components in Next.js 16**

**Prerequisites:**

- [Project Architecture](./01-PROJECT-ARCHITECTURE.md) - Understanding folder structure

---

## Table of Contents

- [Server vs Client Components](#server-vs-client-components)
- [Component Structure](#component-structure)
- [Standard Import Order](#standard-import-order)
- [Component File Template](#component-file-template)
- [Best Practices](#best-practices)

---

## Server vs Client Components

### Decision Tree

Next.js 16 uses **Server Components by default**. Only use Client Components when needed.

```
Does component need:
├─ React hooks? (useState, useEffect, etc.)  → ✅ Client
├─ Event handlers? (onClick, onChange, etc.)  → ✅ Client
├─ Browser APIs? (window, localStorage, etc.) → ✅ Client
├─ React Query hooks? (useQuery, useMutation) → ✅ Client
├─ next-intl hooks? (useTranslations, etc.)   → ✅ Client
├─ Custom hooks that use client hooks?        → ✅ Client
└─ None of the above?                         → ⚡ Server
```

### Server Components (Default)

**NO `"use client"` directive needed**

**Use for:**

- Static pages and layouts
- Pages with `generateMetadata()`
- Server-side data fetching with `async/await`
- SEO metadata and JSON-LD schemas

**Example:**

```tsx
// app/page.tsx - Server Component
import { defaultMetadata } from "@/lib/seo/config";
import { generateWebsiteSchema } from "@/lib/seo/json-ld";
import { HomePageContent } from "./home-content";

export const metadata = defaultMetadata;

export default function HomePage() {
  const schema = generateWebsiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomePageContent />
    </>
  );
}
```

### Client Components

**Require `"use client"` directive** at top of file

**Use for:**

- Components using React hooks (`useState`, `useEffect`, `useReducer`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`localStorage`, `window`, `document`)
- React Query hooks (`useQuery`, `useMutation`)
- next-intl hooks (`useTranslations`, `useFormatter`)
- Custom hooks that use client hooks

**Example:**

```tsx
// app/home-content.tsx - Client Component
"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api/endpoints/manga";

export function HomePageContent() {
  const t = useTranslations("homepage");

  const { data, isLoading } = useQuery({
    queryKey: ["mangas", "recent"],
    queryFn: () => mangaApi.getRecent({ per_page: 12 }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{t("title")}</h1>
      {/* Content */}
    </div>
  );
}
```

### Server Wrapper → Client Content Pattern

**Best practice**: Keep server components at page level, delegate interactive parts to client components

```tsx
// ✅ CORRECT Pattern

// app/manga/[slug]/page.tsx - Server Component
import { generateMangaMetadata } from "@/lib/seo/metadata";
import { MangaDetailContent } from "./manga-detail-content";

export async function generateMetadata({ params }) {
  const manga = await fetchManga(params.slug);
  return generateMangaMetadata(manga);
}

export default function MangaDetailPage({ params }) {
  return <MangaDetailContent slug={params.slug} />;
}

// app/manga/[slug]/manga-detail-content.tsx - Client Component
("use client");

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { mangaApi } from "@/lib/api/endpoints/manga";

export function MangaDetailContent({ slug }: { slug: string }) {
  const t = useTranslations("manga");
  const { data: manga } = useQuery({
    queryKey: ["manga", slug],
    queryFn: () => mangaApi.getDetail(slug),
  });

  return <div>{/* Interactive UI */}</div>;
}
```

---

## Component Structure

### Component Anatomy

```tsx
"use client"; // Only if needed

/**
 * Component Name
 * Brief description of component purpose
 */

// 1. Imports (see import order below)
import { useState } from "react";
import { useTranslations } from "next-intl";
// ...

// 2. Type definitions (if not in separate file)
interface ComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Main component
export function ComponentName({ title, onSubmit }: ComponentProps) {
  // 3a. Hooks (useState, useQuery, custom hooks)
  const t = useTranslations("namespace");
  const [isOpen, setIsOpen] = useState(false);

  // 3b. Derived values
  const formattedTitle = title.toUpperCase();

  // 3c. Event handlers
  const handleClick = () => {
    setIsOpen(true);
  };

  // 3d. Effects (if needed)
  useEffect(() => {
    // Side effects
  }, []);

  // 3e. Render logic
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  // 3f. Main return
  return <div>{/* JSX */}</div>;
}

// 4. Sub-components (small, only used in this file)
function SubComponent() {
  return <div>...</div>;
}
```

---

## Standard Import Order

**Follow this order consistently:**

```tsx
"use client"; // Only if needed

/**
 * ComponentName
 * Component description
 */

// 1. React imports
import { useState, useEffect } from "react";

// 2. External libraries (non-Next.js, non-React)
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

// 3. Next.js imports
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 4. Internal hooks
import { useAuth } from "@/lib/hooks/use-auth";

// 5. Validators/schemas
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";

// 6. Types (with 'type' keyword for type-only imports)
import type { User } from "@/types/user";
import type { Manga } from "@/types/manga";

// 7. UI components (shadcn/ui)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// 8. Icons
import { ChevronDown, Search } from "lucide-react";

// 9. Other utilities
import { cn } from "@/lib/utils";

// Component code
export function ComponentName() {
  // ...
}
```

### Why This Order?

1. **React first** - Core dependency
2. **External libs** - Third-party dependencies
3. **Next.js** - Framework-specific
4. **Internal code** - Project-specific (hooks → types → components → utils)
5. **Logical grouping** - Easy to find imports

---

## Component File Template

### Basic Component Template

```tsx
"use client";

/**
 * ComponentName
 * Brief description of what this component does
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComponentNameProps {
  className?: string;
  // Add props here
}

export function ComponentName({ className }: ComponentNameProps) {
  const t = useTranslations("namespace");
  const [state, setState] = useState(false);

  const handleClick = () => {
    setState(!state);
  };

  return (
    <div className={cn("base-classes", className)}>
      <Button onClick={handleClick}>{t("buttonLabel")}</Button>
    </div>
  );
}
```

### Form Component Template

```tsx
"use client";

/**
 * FormName
 * Description of form purpose
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { formSchema, type FormData } from "@/lib/validators/form-name";
import { apiEndpoint } from "@/lib/api/endpoints/endpoint-name";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

export function FormName() {
  const t = useTranslations("namespace");
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field: "",
    },
  });

  const mutation = useMutation({
    mutationFn: apiEndpoint.create,
    onSuccess: () => {
      toast.success(t("success"));
      router.push("/destination");
    },
    onError: (error) => {
      toast.error(t("error"));
    },
  });

  async function onSubmit(data: FormData) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fieldLabel")}</FormLabel>
              <FormControl>
                <Input {...field} />
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

---

## Best Practices

### Props Interface

Always define props interface:

```tsx
// ✅ CORRECT
interface MangaCardProps {
  manga: Manga;
  onBookmark?: () => void;
  className?: string;
}

export function MangaCard({ manga, onBookmark, className }: MangaCardProps) {
  // ...
}

// ❌ WRONG - No types
export function MangaCard({ manga, onBookmark, className }) {
  // ...
}
```

### Conditional Rendering

Use early returns for loading/error states:

```tsx
// ✅ CORRECT - Early returns
export function Component() {
  const { data, isLoading, error } = useQuery(...)

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />
  if (!data) return <EmptyState />

  return <Content data={data} />
}

// ❌ WRONG - Deeply nested ternaries
export function Component() {
  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <ErrorMessage />
      ) : data ? (
        <Content data={data} />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
```

### Event Handlers

Name with `handle` prefix:

```tsx
// ✅ CORRECT
const handleClick = () => { ... }
const handleSubmit = () => { ... }
const handleChange = (value: string) => { ... }

// ❌ WRONG
const onClick = () => { ... }
const submit = () => { ... }
```

### Sub-Components

Keep sub-components in same file if small and only used there:

```tsx
export function MangaCard({ manga }: MangaCardProps) {
  return (
    <div>
      <CoverImage src={manga.cover_full_url} />
      <CardContent {...manga} />
    </div>
  );
}

// Sub-components (private, small)
function CoverImage({ src }: { src: string }) {
  return <Image src={src} alt="" fill />;
}

function CardContent({ name, author }: { name: string; author: string }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{author}</p>
    </div>
  );
}
```

If sub-components grow large or are reused, move to separate files.

### JSDoc Comments

Add JSDoc for public components:

````tsx
/**
 * MangaCard Component
 * Displays manga cover, title, and metadata in a card format.
 * Supports bookmark action and responsive layout.
 *
 * @example
 * ```tsx
 * <MangaCard manga={manga} onBookmark={handleBookmark} />
 * ```
 */
export function MangaCard({ manga, onBookmark }: MangaCardProps) {
  // ...
}
````

---

## Next.js Specific Patterns

### Image Component

Always use Next.js `Image` component:

```tsx
// ✅ CORRECT
import Image from 'next/image'

<Image
  src={manga.cover_full_url}
  alt={manga.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>

// ❌ WRONG
<img src={manga.cover_full_url} alt={manga.name} />
```

### Link Component

Always use Next.js `Link` component:

```tsx
// ✅ CORRECT
import Link from 'next/link'

<Link href={`/manga/${manga.slug}`}>
  {manga.name}
</Link>

// ❌ WRONG
<a href={`/manga/${manga.slug}`}>
  {manga.name}
</a>
```

---

## Common Patterns

### Conditional Classes

Use `cn()` utility:

```tsx
import { cn } from "@/lib/utils";

<div
  className={cn(
    "base-class",
    isActive && "active-class",
    variant === "primary" && "primary-variant",
    className
  )}
/>;
```

### Loading States

```tsx
if (isLoading) {
  return <Skeleton className="h-48 w-full" />;
}
```

### Error Handling

```tsx
if (error) {
  return <div className="text-red-500">{t("error.loadFailed")}</div>;
}
```

---

## Related Guides

- **[i18n Guide](./06-I18N-GUIDE.md)** - Using translations (MANDATORY for all text)
- **[UI Components](./08-UI-COMPONENTS.md)** - shadcn/ui component usage
- **[State Management](./03-STATE-MANAGEMENT.md)** - When to use client components
- **[SEO Metadata](./07-SEO-METADATA.md)** - Server component metadata patterns

---

## Reference Files

**Good examples to study:**

- `app/page.tsx` - Server/Client split pattern
- `app/home-content.tsx` - Client component with i18n & React Query
- `components/auth/protected-route.tsx` - Route protection pattern
- `lib/hooks/use-auth.ts` - Custom hook pattern

See [Examples Reference](../references/EXAMPLES.md#components) for complete list.

---

**Last updated**: 2025-11-15
