# Hệ Thống Template cho Manga Reader

## Tổng Quan

Tài liệu này hướng dẫn cách tổ chức source code để hỗ trợ **nhiều template/design variants** trong cùng một codebase.

### Mục Đích

- ✅ Quản lý nhiều design variants trong source code
- ✅ Dễ dàng switch template khi deploy (via environment variable)
- ✅ Mỗi template có cấu trúc, layout, màu sắc hoàn toàn khác biệt
- ✅ Tái sử dụng business logic, chỉ thay đổi presentation layer
- ✅ End-user KHÔNG thể switch template (fixed per deployment)

### Use Cases

1. **Multi-tenant**: Deploy nhiều instance với design khác nhau cho từng client
2. **A/B Testing**: Test design variants trên production
3. **White-label**: Cung cấp cho partners với branding riêng
4. **Design Evolution**: Giữ old design khi phát triển new design

---

## 1. Kiến Trúc Đề Xuất

### 1.1 Folder Structure

```
project-root/
├── templates/
│   ├── default/                    # Template hiện tại (original design)
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout với navbar top
│   │   │   ├── page.tsx            # Homepage design
│   │   │   └── (manga)/
│   │   │       └── manga/[slug]/
│   │   │           └── page.tsx    # Manga detail page
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── navbar.tsx      # Top navbar
│   │   │   │   └── footer.tsx
│   │   │   └── manga/
│   │   │       ├── manga-card.tsx  # Card design
│   │   │       └── manga-grid.tsx
│   │   ├── styles/
│   │   │   └── globals.css         # CSS variables, colors
│   │   └── public/
│   │       └── assets/             # Template-specific images/icons
│   │
│   ├── modern/                     # Modern template (sidebar layout)
│   │   ├── app/
│   │   │   ├── layout.tsx          # Layout với sidebar navigation
│   │   │   └── page.tsx            # Grid-based homepage
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── sidebar.tsx     # Sidebar navigation
│   │   │   │   └── topbar.tsx      # Minimal top bar
│   │   │   └── manga/
│   │   │       └── manga-card.tsx  # Modern card design
│   │   ├── styles/
│   │   │   └── globals.css         # Blue accent colors
│   │   └── public/
│   │       └── assets/
│   │
│   └── minimal/                    # Minimal template (content-focused)
│       ├── app/
│       ├── components/
│       ├── styles/
│       └── public/
│
├── shared/                         # SHARED business logic
│   ├── lib/
│   │   ├── api/                    # API clients (KHÔNG duplicate)
│   │   ├── store/                  # Zustand stores
│   │   ├── validators/             # Zod schemas
│   │   ├── seo/                    # SEO utilities
│   │   └── utils/                  # Common utilities
│   ├── types/                      # TypeScript types
│   ├── hooks/                      # Custom React hooks
│   └── messages/                   # i18n translations (shared)
│
├── app/                            # Symlink to active template
├── components/                     # Symlink to active template
├── styles/                         # Symlink to active template
├── public/                         # Merged from template + shared
│
├── .env.local                      # NEXT_PUBLIC_TEMPLATE=default
├── next.config.ts
├── package.json
└── tsconfig.json
```

### 1.2 Template Isolation

Mỗi template có:

| Aspect                | Template-Specific              | Shared    |
| --------------------- | ------------------------------ | --------- |
| **Layout structure**  | ✅ Mỗi template khác nhau      | ❌        |
| **Components**        | ✅ Design variants             | ❌        |
| **CSS/Styles**        | ✅ Colors, typography, spacing | ❌        |
| **Assets**            | ✅ Logos, backgrounds, icons   | ❌        |
| **API clients**       | ❌                             | ✅ Shared |
| **Business logic**    | ❌                             | ✅ Shared |
| **State management**  | ❌                             | ✅ Shared |
| **Validators**        | ❌                             | ✅ Shared |
| **i18n translations** | ❌                             | ✅ Shared |

---

## 2. Implementation Strategy

### 2.1 Environment-Based Template Selection

**.env.local**

```env
# Template selection (default, modern, minimal)
NEXT_PUBLIC_TEMPLATE=default

# Other vars...
NEXT_PUBLIC_API_BASE_URL=...
```

**.env.production**

```env
NEXT_PUBLIC_TEMPLATE=modern
```

### 2.2 Next.js Config - Dynamic Imports

**next.config.ts**

```typescript
import type { NextConfig } from "next";

const activeTemplate = process.env.NEXT_PUBLIC_TEMPLATE || "default";

const nextConfig: NextConfig = {
  // Webpack aliases để resolve template paths
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@template": `${__dirname}/templates/${activeTemplate}`,
      "@shared": `${__dirname}/shared`,
    };
    return config;
  },

  // Import CSS từ active template
  sassOptions: {
    includePaths: [`./templates/${activeTemplate}/styles`],
  },
};

export default nextConfig;
```

### 2.3 TypeScript Config

**tsconfig.json**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@template/*": ["./templates/*/"],
      "@shared/*": ["./shared/*"],
      "@/lib/*": ["./shared/lib/*"],
      "@/types/*": ["./shared/types/*"],
      "@/hooks/*": ["./shared/hooks/*"]
    }
  }
}
```

### 2.4 Build Script với Template Selection

**package.json**

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:modern": "NEXT_PUBLIC_TEMPLATE=modern next dev",
    "dev:minimal": "NEXT_PUBLIC_TEMPLATE=minimal next dev",

    "build": "next build",
    "build:default": "NEXT_PUBLIC_TEMPLATE=default next build",
    "build:modern": "NEXT_PUBLIC_TEMPLATE=modern next build",
    "build:minimal": "NEXT_PUBLIC_TEMPLATE=minimal next build",

    "template:link": "node scripts/link-template.js"
  }
}
```

**scripts/link-template.js**

```javascript
const fs = require("fs");
const path = require("path");

const template = process.env.NEXT_PUBLIC_TEMPLATE || "default";
const templatePath = path.join(__dirname, "..", "templates", template);

// Symlink app/, components/, styles/ to active template
const dirsToLink = ["app", "components", "styles"];

dirsToLink.forEach((dir) => {
  const source = path.join(templatePath, dir);
  const target = path.join(__dirname, "..", dir);

  // Remove existing
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
  }

  // Create symlink
  fs.symlinkSync(source, target, "dir");
  console.log(`✅ Linked ${dir} -> templates/${template}/${dir}`);
});

// Merge public assets
// Copy template public/ vào root public/
const publicSource = path.join(templatePath, "public");
const publicTarget = path.join(__dirname, "..", "public", "template-assets");

if (fs.existsSync(publicSource)) {
  fs.cpSync(publicSource, publicTarget, { recursive: true });
  console.log(`✅ Copied public assets from templates/${template}/public`);
}
```

---

## 3. Template Structure Details

### 3.1 Default Template

**templates/default/app/layout.tsx**

```typescript
import type { Metadata } from "next";
import { Noto_Sans, Road_Rage } from "next/font/google";
import "@template/styles/globals.css"; // Template CSS
import { ThemeProvider } from "@shared/components/providers/theme-provider";
import { Navbar } from "@template/components/layout/navbar";
import { Footer } from "@template/components/layout/footer";
import { generateDefaultMetadata } from "@shared/lib/seo/metadata";

const notoSans = Noto_Sans({ variable: "--font-sans", subsets: ["latin"] });
const roadRage = Road_Rage({ variable: "--font-road-rage", subsets: ["latin"], weight: ["400"] });

export async function generateMetadata(): Promise<Metadata> {
  return generateDefaultMetadata(); // Shared SEO
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${roadRage.variable} antialiased`}>
        <ThemeProvider>
          {/* DEFAULT LAYOUT: Top navbar + content + footer */}
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**templates/default/components/layout/navbar.tsx**

```typescript
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { UserMenu } from "./user-menu";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/template-assets/logo.svg" alt="Logo" className="h-8" />
            <span className="font-road-rage text-2xl">Manga Reader</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse">Duyệt Truyện</Link>
            <Link href="/genres">Thể Loại</Link>
            <Link href="/library">Thư Viện</Link>
          </div>

          {/* Search + User */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**templates/default/styles/globals.css**

```css
@import "tailwindcss";

:root {
  /* Purple theme - Default template */
  --background: oklch(0.9777 0.0041 301.4256);
  --foreground: oklch(0.3651 0.0325 287.0807);
  --primary: oklch(0.6104 0.0767 299.7335);
  --primary-foreground: oklch(0.9777 0.0041 301.4256);

  --radius: 0.5rem;
  --font-sans: var(--font-sans), sans-serif;
}

.dark {
  --background: oklch(0.2166 0.0215 292.8474);
  --foreground: oklch(0.9053 0.0245 293.557);
  --primary: oklch(0.7058 0.0777 302.0489);
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

---

### 3.2 Modern Template

**templates/modern/app/layout.tsx**

```typescript
import "@template/styles/globals.css";
import { Sidebar } from "@template/components/layout/sidebar";
import { Topbar } from "@template/components/layout/topbar";
import { ThemeProvider } from "@shared/components/providers/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {/* MODERN LAYOUT: Sidebar + topbar + content */}
          <div className="flex min-h-screen">
            {/* Sidebar navigation */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**templates/modern/components/layout/sidebar.tsx**

```typescript
import Link from "next/link";
import { Home, Compass, BookMarked, User } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Manga</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarLink href="/" icon={<Home />} label="Trang Chủ" />
        <SidebarLink href="/browse" icon={<Compass />} label="Khám Phá" />
        <SidebarLink href="/library" icon={<BookMarked />} label="Thư Viện" />
        <SidebarLink href="/profile" icon={<User />} label="Tài Khoản" />
      </nav>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
```

**templates/modern/styles/globals.css**

```css
@import "tailwindcss";

:root {
  /* Blue theme - Modern template */
  --background: oklch(0.98 0.002 240);
  --foreground: oklch(0.15 0.01 240);
  --primary: oklch(0.5 0.22 240);
  --primary-foreground: oklch(0.98 0.002 240);
  --sidebar: oklch(0.95 0.005 240);

  --radius: 0.75rem; /* Larger radius for modern look */
  --font-sans: "Inter", sans-serif;
}

.dark {
  --background: oklch(0.12 0.01 240);
  --foreground: oklch(0.95 0.01 240);
  --primary: oklch(0.6 0.25 240);
  --sidebar: oklch(0.1 0.01 240);
}
```

---

## 4. Shared Business Logic

### 4.1 Shared API Client

**shared/lib/api/manga-api.ts**

```typescript
// API client được dùng chung bởi TẤT CẢ templates
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const mangaApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getMangaList(params: MangaListParams) {
  const response = await mangaApi.get("/mangas", { params });
  return response.data;
}

export async function getMangaDetail(slug: string) {
  const response = await mangaApi.get(`/mangas/${slug}`);
  return response.data;
}
```

### 4.2 Shared Store

**shared/lib/store/auth-store.ts**

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const response = await authApi.login(email, password);
        set({ user: response.user, token: response.token });
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
```

Tất cả templates import từ `@shared/lib/store/auth-store` - KHÔNG duplicate logic.

---

## 5. Workflow: Thêm Template Mới

### Bước 1: Tạo Template Folder

```bash
mkdir -p templates/your-template/{app,components/layout,styles,public/assets}
```

### Bước 2: Tạo Layout

**templates/your-template/app/layout.tsx**

```typescript
import "@template/styles/globals.css";
// Import shared providers
import { ThemeProvider } from "@shared/components/providers/theme-provider";
// Import template-specific components
import { YourNavbar } from "@template/components/layout/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider>
          {/* Your unique layout structure */}
          <YourNavbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Bước 3: Tạo CSS Theme

**templates/your-template/styles/globals.css**

```css
@import "tailwindcss";

:root {
  /* Your custom colors */
  --background: oklch(...);
  --primary: oklch(...);
  --radius: ...;
}
```

### Bước 4: Tạo Pages

Copy structure từ `templates/default/app/` và customize designs:

```
templates/your-template/app/
├── page.tsx              # Homepage design
├── (manga)/
│   └── manga/[slug]/
│       └── page.tsx      # Detail page design
└── (user)/
    └── library/
        └── page.tsx      # Library page design
```

### Bước 5: Test Template

```bash
# Run dev server với template mới
NEXT_PUBLIC_TEMPLATE=your-template pnpm dev

# Build
NEXT_PUBLIC_TEMPLATE=your-template pnpm build
```

### Bước 6: Deploy

```bash
# Production build
pnpm build:your-template

# Deploy với env var
# Vercel/Netlify: Set NEXT_PUBLIC_TEMPLATE=your-template
```

---

## 6. Component Reuse Strategy

### 6.1 Khi Nào Tái Sử Dụng Component

**❌ KHÔNG reuse nếu:**

- Design hoàn toàn khác (navbar vs sidebar)
- Layout structure khác (grid vs list)
- Visual style khác (card design, spacing, colors)

**✅ CÓ THỂ reuse nếu:**

- Logic giống nhau nhưng có thể customize qua props
- Sử dụng composition pattern

### 6.2 Composition Pattern

Thay vì duplicate, tạo **base component** trong `shared/` và **compose** trong template:

**shared/components/base/manga-card-base.tsx**

```typescript
interface MangaCardBaseProps {
  manga: Manga;
  renderThumbnail: (manga: Manga) => React.ReactNode;
  renderInfo: (manga: Manga) => React.ReactNode;
}

export function MangaCardBase({ manga, renderThumbnail, renderInfo }: MangaCardBaseProps) {
  return (
    <div>
      {renderThumbnail(manga)}
      {renderInfo(manga)}
    </div>
  );
}
```

**templates/default/components/manga/manga-card.tsx**

```typescript
import { MangaCardBase } from "@shared/components/base/manga-card-base";

export function MangaCard({ manga }: { manga: Manga }) {
  return (
    <MangaCardBase
      manga={manga}
      renderThumbnail={(m) => (
        <img src={m.cover} alt={m.title} className="aspect-[3/4] rounded-lg" />
      )}
      renderInfo={(m) => (
        <div className="p-4">
          <h3 className="font-bold">{m.title}</h3>
          <p className="text-sm text-muted-foreground">{m.author}</p>
        </div>
      )}
    />
  );
}
```

**templates/modern/components/manga/manga-card.tsx**

```typescript
import { MangaCardBase } from "@shared/components/base/manga-card-base";

export function MangaCard({ manga }: { manga: Manga }) {
  return (
    <MangaCardBase
      manga={manga}
      renderThumbnail={(m) => (
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <img src={m.cover} alt={m.title} className="object-cover" />
        </div>
      )}
      renderInfo={(m) => (
        <div className="mt-3 space-y-1">
          <h3 className="text-lg font-semibold">{m.title}</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-primary/10 px-2 py-1 rounded">{m.genre}</span>
            <span>{m.views} views</span>
          </div>
        </div>
      )}
    />
  );
}
```

---

## 7. Best Practices

### ✅ DO

1. **Template Isolation**: Mỗi template độc lập, self-contained
2. **Shared Logic**: API, stores, validators ở `shared/` - KHÔNG duplicate
3. **Environment-Based**: Switch template qua `.env`, KHÔNG runtime
4. **Type-Safe**: TypeScript cho tất cả shared code
5. **Document**: Mô tả design decisions của mỗi template
6. **Version Control**: Tag releases cho mỗi template variant

### ❌ DON'T

1. **KHÔNG duplicate business logic** giữa templates
2. **KHÔNG hardcode template name** trong code
3. **KHÔNG cho user switch template** (admin-only via deploy)
4. **KHÔNG mix template code** với shared code
5. **KHÔNG skip testing** cho template mới

---

## 8. Migration từ Codebase Hiện Tại

### Bước 1: Tạo Shared Folder

```bash
mkdir -p shared/{lib,types,hooks}
mv lib/* shared/lib/
mv types/* shared/types/
mv hooks/* shared/hooks/
```

### Bước 2: Tạo Default Template

```bash
mkdir -p templates/default/{app,components,styles,public}
mv app/* templates/default/app/
mv components/* templates/default/components/
mv app/globals.css templates/default/styles/
cp -r public/* templates/default/public/
```

### Bước 3: Update Imports

Replace:

```typescript
import { getMangaList } from "@/lib/api/manga-api";
```

Với:

```typescript
import { getMangaList } from "@shared/lib/api/manga-api";
```

### Bước 4: Setup Build Scripts

Update `package.json`, `next.config.ts` theo section 2.2, 2.3

### Bước 5: Test

```bash
pnpm template:link
pnpm dev
```

---

## 9. FAQ

### Q: Tại sao không dùng runtime template switching?

**A:**

- ❌ Tăng bundle size (include tất cả templates)
- ❌ Performance overhead (runtime checks)
- ❌ User không cần switching (fixed per deployment)
- ✅ Build-time selection: Smaller bundle, better performance

### Q: Làm sao deploy nhiều template cùng lúc?

**A:** Deploy nhiều instance với env vars khác nhau:

```
- app1.example.com → NEXT_PUBLIC_TEMPLATE=default
- app2.example.com → NEXT_PUBLIC_TEMPLATE=modern
- app3.example.com → NEXT_PUBLIC_TEMPLATE=minimal
```

### Q: Có thể mix components từ nhiều templates?

**A:** KHÔNG nên. Mỗi template nên consistent. Nếu muốn reuse, tạo base component trong `shared/` với composition pattern.

### Q: Làm sao debug template-specific issues?

**A:**

```bash
# Run specific template
NEXT_PUBLIC_TEMPLATE=modern pnpm dev

# Check active template
echo $NEXT_PUBLIC_TEMPLATE
```

---

## 10. Kết Luận

Hệ thống template này:

- ✅ **Modular**: Dễ thêm/xóa templates
- ✅ **Maintainable**: Tách biệt presentation vs logic
- ✅ **Scalable**: Deploy nhiều variants từ 1 codebase
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Performance**: Build-time selection, không overhead runtime

**Recommended Flow:**

1. Phát triển template mới trong `templates/your-template/`
2. Test local: `NEXT_PUBLIC_TEMPLATE=your-template pnpm dev`
3. Build: `pnpm build:your-template`
4. Deploy với env var set đúng template ID
5. Monitor và iterate

---

## Liên Quan

- [Getting Started](./00-GETTING-STARTED.md)
- [Project Architecture](./01-PROJECT-ARCHITECTURE.md)
- [Coding Standards](../references/CODING-STANDARDS.md)
