# UI Components

**Using shadcn/ui components and styling patterns**

**Prerequisites:**

- [Component Patterns](./02-COMPONENT-PATTERNS.md) - Component structure

---

## Table of Contents

- [shadcn/ui Setup](#shadcnui-setup)
- [Installed Components](#installed-components)
- [Import Patterns](#import-patterns)
- [Using Components](#using-components)
- [Styling with Tailwind](#styling-with-tailwind)
- [Toast Notifications](#toast-notifications)
- [Adding New Components](#adding-new-components)
- [The NEVER MODIFY Rule](#the-never-modify-rule)

---

## shadcn/ui Setup

### Configuration

**Style**: New York
**Base color**: Neutral
**CSS variables**: Yes
**React Server Components**: Yes
**TypeScript**: Yes

**Config file**: `components.json`

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Installed Components

### Currently Available

Located in `components/ui/`:

- **button** - Button component with variants
- **input** - Text input field
- **textarea** - Multi-line text input
- **label** - Form label
- **select** - Dropdown select
- **form** - Form components with React Hook Form integration
- **card** - Card container with header/content/footer
- **badge** - Status badge/tag
- **avatar** - User avatar with fallback
- **skeleton** - Loading skeleton placeholder
- **dialog** - Modal dialog
- **dropdown-menu** - Dropdown menu
- **tabs** - Tabbed interface
- **sonner** - Toast notifications (via Sonner)

### Documentation

**Official docs**: https://ui.shadcn.com

Each component has:

- API documentation
- Examples and demos
- Accessibility notes
- Customization options

---

## Import Patterns

### Basic Import

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
```

### Form Components

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
```

### All Imports at Once

```tsx
// Multiple components from same module
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
```

---

## Using Components

### Button

```tsx
import { Button } from '@/components/ui/button'

// Variants: default, destructive, outline, secondary, ghost, link
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes: default, sm, lg, icon
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon />
</Button>

// Disabled and loading states
<Button disabled>Disabled</Button>
<Button disabled>
  <Loader className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

### Input

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
  />
</div>

// With error state
<Input className="border-red-500" />
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge'

// Variants: default, secondary, destructive, outline
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// Usage with manga status
<Badge variant={manga.status === 'completed' ? 'secondary' : 'default'}>
  {t(`status.${manga.status}`)}
</Badge>
```

### Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src={user.avatar_url} alt={user.name} />
  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
</Avatar>;
```

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div>{/* Dialog content */}</div>
  </DialogContent>
</Dialog>;
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>;
```

### Skeleton (Loading State)

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Simple skeleton
<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-4 w-[250px]" />

// Card skeleton
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-32 w-full" />
  </CardContent>
</Card>
```

---

## Styling with Tailwind

### The `cn()` Utility

**Location**: `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Using `cn()` for Conditional Classes

```tsx
import { cn } from "@/lib/utils";

<div
  className={cn(
    "base-class",
    isActive && "active-class",
    variant === "primary" && "bg-primary text-primary-foreground",
    className // Allow prop-based override
  )}
/>;
```

### Examples

**Button with conditional styles:**

```tsx
<Button
  className={cn(
    "relative",
    isLoading && "cursor-not-allowed opacity-50",
    isFullWidth && "w-full"
  )}
>
  {children}
</Button>
```

**Card with variants:**

```tsx
interface CardProps {
  variant?: "default" | "bordered" | "elevated";
  className?: string;
}

<Card
  className={cn(
    variant === "bordered" && "border-2",
    variant === "elevated" && "shadow-lg",
    className
  )}
>
  {children}
</Card>;
```

### Responsive Classes

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid: 1 col mobile, 2 tablet, 4 desktop */}
</div>

<Button className="w-full md:w-auto">
  {/* Full width mobile, auto desktop */}
</Button>
```

---

## Toast Notifications

### Sonner Setup

Already configured in root layout via `<Toaster />` component.

### Usage

```tsx
import { toast } from "sonner";

// Success toast
toast.success("Success!", {
  description: "Operation completed successfully",
});

// Error toast
toast.error("Error!", {
  description: "Something went wrong",
});

// Info toast
toast("Info", {
  description: "Some information",
});

// Loading toast
toast.loading("Loading...");

// Promise toast (auto-updates based on promise state)
toast.promise(fetchData(), {
  loading: "Loading...",
  success: "Data loaded!",
  error: "Failed to load data",
});

// With action button
toast("Event created", {
  description: "Your event has been created",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

### With Translations

```tsx
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const t = useTranslations("common");

toast.success(t("saveSuccess"), {
  description: t("saveSuccessDescription"),
});

toast.error(t("error"), {
  description: t("saveErrorDescription"),
});
```

---

## Adding New Components

### CLI Command

```bash
pnpm dlx shadcn@latest add [component-name]
```

### Examples

```bash
# Add single component
pnpm dlx shadcn@latest add checkbox

# Add multiple components
pnpm dlx shadcn@latest add checkbox radio-group switch

# List all available components
pnpm dlx shadcn@latest add
```

### After Adding

1. Component files created in `components/ui/`
2. Dependencies automatically installed
3. Import and use immediately

```tsx
// After running: pnpm dlx shadcn@latest add checkbox
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox id="terms" />;
```

---

## The NEVER MODIFY Rule

### ⚠️ CRITICAL RULE

**NEVER modify files in `components/ui/`**

These are base components from shadcn/ui. Modifying them makes updates difficult and breaks consistency.

### ❌ WRONG - Modifying base components

```tsx
// ❌ NEVER DO THIS
// components/ui/button.tsx
export function Button() {
  // Adding custom logic here
  const [isSpecial, setIsSpecial] = useState(false);
  // ...
}
```

### ✅ CORRECT - Create Wrappers

Create custom components that wrap shadcn/ui components:

```tsx
// ✅ CORRECT - components/manga/bookmark-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  mangaId: number;
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
}

export function BookmarkButton({
  mangaId,
  isBookmarked,
  onToggle,
  className,
}: BookmarkButtonProps) {
  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="icon"
      onClick={onToggle}
      className={cn("relative", className)}
    >
      <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
    </Button>
  );
}
```

### Composition Pattern

```tsx
// ✅ CORRECT - Compose base components
export function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Input {...props} className={cn(error && "border-red-500")} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

---

## Best Practices

### 1. Always Use shadcn/ui Components

```tsx
// ✅ CORRECT - Use shadcn/ui
import { Button } from '@/components/ui/button'
<Button>Click me</Button>

// ❌ WRONG - Native HTML
<button className="...">Click me</button>
```

### 2. Translate All Text

```tsx
import { useTranslations } from 'next-intl'

const t = useTranslations('common')

<Button>{t('save')}</Button>
<Label>{t('email')}</Label>
```

### 3. Use `cn()` for Conditional Styling

```tsx
<div className={cn("base", isActive && "active", className)} />
```

### 4. Provide Accessible Labels

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

### 5. Handle Loading States

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader className="mr-2 h-4 w-4 animate-spin" />
      {t("loading")}
    </>
  ) : (
    t("submit")
  )}
</Button>
```

---

## Common Patterns

### Form Field Pattern

```tsx
<div className="space-y-2">
  <Label htmlFor="name">{t("nameLabel")}</Label>
  <Input id="name" placeholder={t("namePlaceholder")} {...field} />
  {error && <p className="text-sm text-red-500">{error.message}</p>}
</div>
```

### Card Grid Pattern

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map((item) => (
    <Card key={item.id}>
      <CardContent>{/* Content */}</CardContent>
    </Card>
  ))}
</div>
```

### Loading Skeleton Pattern

```tsx
{
  isLoading ? (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-72" />
      ))}
    </div>
  ) : (
    <MangaGrid mangas={data} />
  );
}
```

---

## Related Guides

- **[Component Patterns](./02-COMPONENT-PATTERNS.md)** - Component structure
- **[Forms & Validation](./05-FORMS-VALIDATION.md)** - Using Form components
- **[i18n Guide](./06-I18N-GUIDE.md)** - Translating component text

---

## Resources

- **shadcn/ui docs**: https://ui.shadcn.com
- **Radix UI docs**: https://www.radix-ui.com
- **Tailwind CSS docs**: https://tailwindcss.com
- **Sonner docs**: https://sonner.emilkowal.ski

---

**Last updated**: 2025-11-15
