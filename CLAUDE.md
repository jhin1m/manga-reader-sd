# CLAUDE.md - Hướng dẫn Phát triển Manga Reader CMS

## Mục lục

1. [Giới thiệu Dự án](#giới-thiệu-dự-án)
2. [Tech Stack](#tech-stack)
3. [shadcn/ui Setup & Usage](#shadcnui-setup--usage)
4. [Kiến trúc Dự án](#kiến-trúc-dự-án)
5. [Quy trình Làm việc](#quy-trình-làm-việc)
6. [Hướng dẫn Phát triển](#hướng-dẫn-phát-triển)
7. [Conventions & Standards](#conventions--standards)
8. [Tài liệu API](#tài-liệu-api)

---

## Giới thiệu Dự án

**Manga Reader CMS** là một nền tảng đọc truyện tranh trực tuyến với đầy đủ tính năng:

- Đọc manga với trải nghiệm mượt mà
- Quản lý thư viện cá nhân
- Bình luận, đánh giá
- Tìm kiếm và lọc manga theo nhiều tiêu chí
- Hệ thống điểm và thành tựu
- OAuth authentication (Google)

### Backend API

- **URL**: `http://localhost:8000/api/v1`
- **Framework**: Laravel + Sanctum
- **Tài liệu**: `/docs/API_DOCUMENTATION.md`

### Frontend

- **URL Dev**: `http://localhost:3000`
- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS v4

---

## Tech Stack

### Frontend

```json
{
  "framework": "Next.js 16.0.1",
  "react": "19.2.0",
  "language": "TypeScript 5+",
  "styling": "Tailwind CSS v4",
  "packageManager": "pnpm 10.17.1"
}
```

### Libraries được khuyến nghị

- **State Management**: Zustand / Context API
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image
- **Notifications**: Sonner

### Installed Dependencies

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-tabs": "^1.1.13",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.552.0",
    "next-themes": "^0.4.6",
    "react-hook-form": "^7.65.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "zod": "^4.1.12"
  }
}
```

---

## shadcn/ui Setup & Usage

### Đã cài đặt (✅ Completed)

**Config**: Style New York, Base color Neutral, RSC enabled

**Components đã cài:**

- ✅ `button` - Buttons với nhiều variants
- ✅ `input` - Text inputs
- ✅ `textarea` - Multi-line text input
- ✅ `label` - Form labels
- ✅ `select` - Dropdown select
- ✅ `form` - Form wrapper với React Hook Form
- ✅ `card` - Card containers
- ✅ `badge` - Status badges, tags
- ✅ `avatar` - User avatars, manga covers
- ✅ `skeleton` - Loading skeletons
- ✅ `dialog` - Modal dialogs
- ✅ `dropdown-menu` - Dropdown menus
- ✅ `tabs` - Tab navigation
- ✅ `sonner` - Toast notifications

### Cách sử dụng shadcn/ui

#### 1. Import và sử dụng component cơ bản

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MangaCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>One Piece</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>Action</Badge>
        <Button>Read Now</Button>
      </CardContent>
    </Card>
  );
}
```

#### 2. Form với React Hook Form + Zod

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    // Call API here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
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
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
```

#### 3. Toast Notifications với Sonner

```tsx
// app/layout.tsx - Add Toaster to root layout
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

```tsx
// Sử dụng trong components
"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function BookmarkButton() {
  const handleBookmark = () => {
    // Call API...
    toast.success("Added to bookmarks!", {
      description: "You can find it in your library",
    });
  };

  return <Button onClick={handleBookmark}>Bookmark</Button>;
}
```

#### 4. Dialog/Modal

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

export function ShareDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this manga</DialogTitle>
          <DialogDescription>
            Copy the link below to share with friends
          </DialogDescription>
        </DialogHeader>
        {/* Share content */}
      </DialogContent>
    </Dialog>
  );
}
```

#### 5. Loading States với Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MangaCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-48 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

// Sử dụng
export function MangaList() {
  const { data, isLoading } = useQuery(...);

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MangaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return <div>{/* Render actual data */}</div>;
}
```

#### 6. Dropdown Menu cho Navigation

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="/user-avatar.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Library</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Cài thêm components khi cần

```bash
# Xem tất cả components available
pnpm dlx shadcn@latest add

# Cài component cụ thể
pnpm dlx shadcn@latest add [component-name]

# Ví dụ:
pnpm dlx shadcn@latest add accordion
pnpm dlx shadcn@latest add alert-dialog
pnpm dlx shadcn@latest add scroll-area
pnpm dlx shadcn@latest add separator
```

### Utility Function: cn()

File `lib/utils.ts` chứa `cn()` helper để merge Tailwind classes:

```tsx
import { cn } from "@/lib/utils";

// Sử dụng cn() để merge classes conditionally
<Button
  className={cn(
    "base-class",
    isActive && "active-class",
    variant === "primary" && "primary-class"
  )}
>
  Click me
</Button>;
```

### Best Practices

1. **Always use cn() cho conditional classes**

   ```tsx
   // ✅ GOOD
   <div className={cn("base", isActive && "active")} />

   // ❌ BAD
   <div className={`base ${isActive ? "active" : ""}`} />
   ```

2. **Extend components khi cần customize**

   ```tsx
   // components/custom/primary-button.tsx
   import { Button } from "@/components/ui/button";

   export function PrimaryButton({ children, ...props }) {
     return (
       <Button className="bg-primary hover:bg-primary/90" {...props}>
         {children}
       </Button>
     );
   }
   ```

3. **Tái sử dụng components**
   - Tạo wrapper components cho use cases cụ thể
   - Giữ UI components trong `/components/ui` không modified
   - Custom components trong `/components/[feature]/`

---

## Kiến trúc Dự án

### Cấu trúc thư mục đề xuất

```
manga-reader-sd/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group routes
│   │   ├── login/
│   │   └── register/
│   ├── (manga)/                  # Main manga routes
│   │   ├── page.tsx             # Homepage
│   │   ├── manga/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx     # Manga detail
│   │   │       └── [chapter]/
│   │   │           └── page.tsx # Chapter reader
│   │   ├── search/
│   │   └── genres/
│   ├── (user)/                   # User routes
│   │   ├── profile/
│   │   └── library/
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   ├── manga/                   # Manga-specific components
│   ├── reader/                  # Chapter reader components
│   ├── auth/                    # Auth components
│   └── layout/                  # Layout components
├── lib/                         # Utilities & configs
│   ├── api/                     # API client
│   │   ├── client.ts           # Axios/Fetch config
│   │   ├── endpoints/          # API endpoints
│   │   └── types/              # API types
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # State management
│   ├── utils/                   # Helper functions
│   └── constants/               # Constants
├── types/                       # TypeScript types
├── public/                      # Static assets
├── docs/                        # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── ROADMAP.md
│   └── FEATURES.md
└── CLAUDE.md                    # This file
```

---

## Quy trình Làm việc

### 1. Development Workflow

#### Bước 1: Setup môi trường

```bash
# Clone và cài đặt
pnpm install

# Chạy development server
pnpm dev

# Mở browser tại http://localhost:3000
```

### 2. API Integration Workflow

#### Bước 1: Định nghĩa Types

```typescript
// types/manga.ts
export interface Manga {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  pilot: string;
  status: 1 | 2; // 1=ongoing, 2=completed
  cover_full_url: string;
  average_rating: number;
  views: number;
  // ... other fields
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}
```

#### Bước 2: Tạo API Functions

```typescript
// lib/api/endpoints/manga.ts
import { apiClient } from "../client";

export const mangaApi = {
  getList: async (params?: MangaListParams) => {
    return apiClient.get<ApiResponse<Manga[]>>("/mangas", { params });
  },

  getDetail: async (slug: string) => {
    return apiClient.get<ApiResponse<Manga>>(`/mangas/${slug}`);
  },

  // ... more methods
};
```

#### Bước 3: Sử dụng trong Component

```typescript
// app/(manga)/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api/endpoints/manga";

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["mangas"],
    queryFn: () => mangaApi.getList({ per_page: 20 }),
  });

  // Render UI...
}
```

### 3. Component Development Workflow

#### Nguyên tắc Atomic Design

```
atoms/        → Các component nhỏ nhất (Button, Input, Badge)
molecules/    → Tổ hợp atoms (SearchBar, MangaCard)
organisms/    → Tổ hợp molecules (MangaGrid, Header, Footer)
templates/    → Layout templates
pages/        → Actual pages (trong app/)
```

#### Example Component Structure

```typescript
// components/manga/MangaCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Manga } from '@/types/manga';

interface MangaCardProps {
  manga: Manga;
  variant?: 'default' | 'compact';
}

export function MangaCard({ manga, variant = 'default' }: MangaCardProps) {
  return (
    <Link href={`/manga/${manga.slug}`}>
      <div className="group relative overflow-hidden rounded-lg">
        <Image
          src={manga.cover_full_url}
          alt={manga.name}
          width={200}
          height={280}
          className="transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4">
          <h3 className="font-semibold text-white">{manga.name}</h3>
          <Badge variant="secondary">{manga.latest_chapter?.name}</Badge>
        </div>
      </div>
    </Link>
  );
}
```

### 4. State Management Strategy

#### Local State (useState, useReducer)

- Component-specific state
- Form state
- UI toggles

#### Server State (React Query)

- API data fetching
- Caching
- Automatic refetching

#### Global State (Zustand)

- User authentication state
- Theme preferences
- Reading history
- Bookmarks

```typescript
// lib/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "auth-storage" }
  )
);
```

---

## Hướng dẫn Phát triển

### Phase 1: Core Setup (Week 1)

**1.1 Setup Project Structure**

- [ ] Tạo cấu trúc thư mục theo kiến trúc đề xuất
- [ ] Setup Tailwind CSS config với theme tùy chỉnh
- [ ] Cài đặt và config các libraries cần thiết
- [ ] Setup ESLint + Prettier cho consistent code

**1.2 API Client Setup**

- [ ] Tạo axios/fetch client với interceptors
- [ ] Setup authentication headers
- [ ] Handle refresh token logic
- [ ] Error handling middleware
- [ ] Type definitions cho tất cả API responses

**1.3 Base Components**

- [ ] Button, Input, Card, Badge, Avatar
- [ ] Loading states (Skeleton, Spinner)
- [ ] Error states (ErrorBoundary)
- [ ] Layout components (Header, Footer, Sidebar)

### Phase 2: Authentication (Week 1-2)

**2.1 Login/Register Pages**

- [ ] Form validation với Zod
- [ ] Email/Password authentication
- [ ] Error handling & user feedback
- [ ] Redirect logic sau login

**2.2 Google OAuth**

- [ ] Setup Google OAuth client
- [ ] Implement OAuth flow
- [ ] Handle OAuth callbacks

**2.3 Protected Routes**

- [ ] Middleware cho route protection
- [ ] Redirect unauthenticated users
- [ ] Role-based access (nếu có)

### Phase 3: Manga Features (Week 2-3)

**3.1 Homepage**

- [ ] Recently updated mangas
- [ ] Hot/Trending section
- [ ] Genre filters
- [ ] Search functionality
- [ ] Pagination

**3.2 Manga Detail Page**

- [ ] Manga information display
- [ ] Genres, Artist, Group info
- [ ] Chapter list với sorting
- [ ] Rating & Comments section
- [ ] Bookmark/Favorite button
- [ ] Share functionality

**3.3 Chapter Reader**

- [ ] Image loading optimization
- [ ] Navigation controls (next/prev chapter)
- [ ] Reading progress tracking
- [ ] Reading modes (single page, long strip)
- [ ] Zoom controls
- [ ] Keyboard shortcuts

**3.4 Search & Filters**

- [ ] Advanced search với multiple filters
- [ ] Genre filtering
- [ ] Status filtering (ongoing/completed)
- [ ] Sort options (views, rating, updated)
- [ ] Search debouncing

### Phase 4: User Features (Week 3-4)

**4.1 User Profile**

- [ ] Display user info
- [ ] Edit profile
- [ ] Avatar upload
- [ ] Points & achievements display

**4.2 User Library**

- [ ] Reading history
- [ ] Bookmarks/Favorites
- [ ] Continue reading section
- [ ] Reading statistics

**4.3 Comments & Ratings**

- [ ] Comment form
- [ ] Rating system
- [ ] Like/Reply to comments
- [ ] Spam/Report functionality

### Phase 5: Polish & Optimization (Week 4-5)

**5.1 Performance Optimization**

- [ ] Image lazy loading
- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] Caching strategies

**5.2 SEO & Meta**

- [ ] Dynamic meta tags
- [ ] Open Graph tags
- [ ] Sitemap generation
- [ ] Structured data

**5.3 Mobile Responsiveness**

- [ ] Mobile navigation
- [ ] Touch gestures for reader
- [ ] Responsive layouts
- [ ] Mobile-specific optimizations

**5.4 Testing**

- [ ] Unit tests cho utils
- [ ] Component tests
- [ ] E2E tests cho critical flows
- [ ] Performance testing

---

## Conventions & Standards

### TypeScript

```typescript
// ✅ GOOD: Explicit types
interface UserProps {
  name: string;
  email: string;
}

// ❌ BAD: Any types
const user: any = { ... };

// ✅ GOOD: Type inference when obvious
const count = 5; // inferred as number
```

### Naming Conventions

```typescript
// Components: PascalCase
export function MangaCard() { ... }

// Functions/Variables: camelCase
const fetchMangaList = () => { ... };

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000';

// Types/Interfaces: PascalCase
interface MangaCardProps { ... }
```

### File Structure

```typescript
// Each file should have single responsibility
// ✅ GOOD
manga-card.tsx          // Component only
manga-card.types.ts     // Types only
manga-card.styles.ts    // Styles only (if needed)

// ❌ BAD
manga-card-with-everything.tsx  // Component + Types + Utils + ...
```

### Git Commit Messages

```
feat: thêm manga detail page
fix: sửa lỗi chapter navigation
refactor: cải thiện API client structure
docs: cập nhật CLAUDE.md
style: format code với prettier
test: thêm tests cho MangaCard component
```

### Code Comments

```typescript
// ✅ GOOD: Explain WHY, not WHAT
// Use debounce để tránh gọi API quá nhiều khi user đang gõ
const debouncedSearch = useDebouncedValue(searchTerm, 300);

// ❌ BAD: Obvious comments
// Set count to 0
const count = 0;
```

---

## Tài liệu API

### Authentication

- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/google` - Google OAuth
- `POST /auth/logout` - Logout user

### Manga

- `GET /mangas` - List mangas (with pagination, filters)
- `GET /mangas/recent` - Recently updated
- `GET /mangas/hot` - Hot/Trending mangas
- `GET /mangas/search` - Search mangas
- `GET /mangas/{slug}` - Manga detail
- `GET /mangas/{slug}/chapters` - Chapter list

### Chapters

- `GET /mangas/{slug}/chapters/{chapterSlug}` - Chapter detail + images
- `POST /chapters/{id}/view` - Track chapter view

### User

- `GET /user/profile` - Get current user
- `PUT /user/profile` - Update profile
- `POST /user/avatar` - Upload avatar

### Library

- `GET /user/history` - Reading history
- `GET /user/bookmarks` - Bookmarked mangas
- `POST /user/bookmarks` - Add bookmark
- `DELETE /user/bookmarks/{id}` - Remove bookmark

### Comments & Ratings

- `GET /mangas/{id}/comments` - Get comments
- `POST /mangas/{id}/comments` - Add comment
- `POST /mangas/{id}/ratings` - Rate manga

### Genres

- `GET /genres` - List all genres

Xem chi tiết tại: `/docs/API_DOCUMENTATION.md`

---

## Debug & Troubleshooting

### Common Issues

**1. CORS Error**

```
Kiểm tra backend CORS config
Đảm bảo frontend URL được whitelist
```

**2. Authentication Token Issues**

```typescript
// Check token in localStorage/cookies
console.log(localStorage.getItem('auth-token'));

// Verify token format
Authorization: Bearer {token}
```

**3. Image Loading Issues**

```typescript
// Next.js requires domain config
// next.config.ts
export default {
  images: {
    domains: ["domain.example", "localhost"],
  },
};
```

**4. Build Errors**

```bash
# Clear cache và rebuild
rm -rf .next
pnpm install
pnpm build
```

---

## Resources & Links

### Documentation

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools

- [React Query DevTools](https://tanstack.com/query/latest)
- [Zustand DevTools](https://github.com/pmndrs/zustand#devtools)

### Design Resources

- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## Contact & Support

Nếu gặp vấn đề hoặc cần hỗ trợ:

1. Check documentation này trước
2. Check API_DOCUMENTATION.md
3. Check ROADMAP.md để xem tiến độ
4. Tạo issue trong project (nếu dùng Git hosting)

---

**Happy Coding! 🚀**

_Last updated: 2025-10-31_
