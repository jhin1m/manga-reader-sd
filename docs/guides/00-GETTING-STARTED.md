# Getting Started

**Quick start guide for Manga Reader CMS development**

## Overview

**Manga Reader CMS** - Modern manga reading platform built with Next.js 16 + Laravel API

- **Backend**: `http://localhost:8000/api/v1` (Laravel + Sanctum)
- **Frontend**: `http://localhost:3000` (Next.js 16 App Router)
- **Documentation**: `/docs/` directory

---

## Tech Stack

### Core Technologies

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5+
- **Package Manager**: pnpm 10.17.1

### Styling & UI

- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Design System**: New York style, Neutral color

### State & Data Management

- **Client State**: Zustand
- **Server State**: React Query (TanStack Query v5)
- **Forms**: React Hook Form + Zod validation

### Additional Features

- **Internationalization**: next-intl (default: Vietnamese)
- **Notifications**: Sonner
- **Authentication**: Laravel Sanctum + Google OAuth

---

## Installation

### Prerequisites

- Node.js 18+ or 20+
- pnpm 10.17.1+
- Git

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd manga-reader-sd
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**
   Create `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure Overview

```
manga-reader-sd/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (manga)/           # Manga browsing & reading
│   └── (user)/            # User profile & library
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── manga/             # Manga-specific components
│   ├── auth/              # Auth forms & components
│   └── layout/            # Navigation, footer
├── lib/
│   ├── api/               # API client & endpoints
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand stores
│   ├── seo/               # SEO configuration
│   └── validators/        # Zod schemas
├── messages/              # i18n translations
└── types/                 # TypeScript type definitions
```

**For detailed architecture**, see [Project Architecture Guide](./01-PROJECT-ARCHITECTURE.md)

---

## Providers Setup

The application uses several providers configured in `app/layout.tsx`:

### Provider Hierarchy

```tsx
<NextIntlClientProvider>
  {" "}
  // Internationalization
  <ReactQueryProvider>
    {" "}
    // Server state management
    <GoogleOAuthProvider>
      {" "}
      // Google authentication
      <ThemeProvider>
        {" "}
        // Dark/light mode
        {children}
      </ThemeProvider>
    </GoogleOAuthProvider>
  </ReactQueryProvider>
</NextIntlClientProvider>
```

### React Query Configuration

- `refetchOnWindowFocus: false` - Prevents auto-refetch on window focus
- `retry: 1` - Retries failed requests once
- `staleTime: 5 * 60 * 1000` - Caches data for 5 minutes

---

## Development Workflow

### Standard Development Flow

1. **Start development server**

   ```bash
   pnpm dev
   ```

2. **Make changes** to code

3. **Lint & type-check** (optional but recommended)

   ```bash
   pnpm lint
   pnpm type-check
   ```

4. **Build for production** (to verify)
   ```bash
   pnpm build
   ```

### Working with the API

1. **Define types** in `types/` or `lib/api/types/`
2. **Create API functions** in `lib/api/endpoints/`
3. **Use with React Query** in components:
   ```tsx
   const { data, isLoading } = useQuery({
     queryKey: ["mangas", "recent"],
     queryFn: () => mangaApi.getRecent(),
   });
   ```

**For detailed API patterns**, see [API Integration Guide](./04-API-INTEGRATION.md)

---

## Next Steps

### For New Developers

Follow this learning path:

1. **Understand the architecture** → [Project Architecture](./01-PROJECT-ARCHITECTURE.md)
2. **Learn component patterns** → [Component Patterns](./02-COMPONENT-PATTERNS.md)
3. **Review coding standards** → [Coding Standards](../references/CODING-STANDARDS.md)
4. **Study good examples** → [Examples Reference](../references/EXAMPLES.md)

### For Specific Tasks

Use the quick reference:

- **Creating components** → [Task-to-Docs Mapping](../TASK-TO-DOCS-MAPPING.md#creating-a-new-component)
- **Working with forms** → [Forms & Validation Guide](./05-FORMS-VALIDATION.md)
- **API integration** → [API Integration Guide](./04-API-INTEGRATION.md)
- **Translations** → [i18n Guide](./06-I18N-GUIDE.md) (CRITICAL - all text must be translated)

---

## Common Commands

| Command                                  | Description                   |
| ---------------------------------------- | ----------------------------- |
| `pnpm dev`                               | Start development server      |
| `pnpm build`                             | Build for production          |
| `pnpm lint`                              | Run ESLint                    |
| `pnpm type-check`                        | Run TypeScript compiler check |
| `pnpm dlx shadcn@latest add [component]` | Add shadcn/ui component       |

---

## Important Notes

### Critical Rules (Always Follow)

1. **Translations**: ALL user-facing text MUST use `useTranslations()` - NO hardcoded strings
   - See [i18n Guide](./06-I18N-GUIDE.md)

2. **SEO**: Use centralized SEO configuration, never hardcode metadata
   - See [SEO Guide](./07-SEO-METADATA.md)

3. **Code Quality**: Run checklist before every commit
   - See [Pre-commit Checklist](../references/CHECKLIST.md)

---

## Getting Help

- **API Documentation**: See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
- **Project Roadmap**: See [ROADMAP.md](../ROADMAP.md)
- **Quick Task Lookup**: See [TASK-TO-DOCS-MAPPING.md](../TASK-TO-DOCS-MAPPING.md)
- **All Guides**: See [Documentation Index](../README.md)

---

**Last updated**: 2025-11-15
