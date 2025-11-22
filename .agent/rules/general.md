---
trigger: always_on
---

# Manga Reader CMS

**Modern manga reading platform built with Next.js 16 + Laravel API**

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📚 Documentation

**Complete development documentation is available in the `/docs` folder:**

👉 **[Read the Documentation](./docs/README.md)**

### Quick Links

- **[Getting Started Guide](./docs/guides/00-GETTING-STARTED.md)** - Installation, setup, tech stack
- **[i18n Guide](./docs/guides/06-I18N-GUIDE.md)** - ⚠️ **CRITICAL** - Translation rules (MUST READ)
- **[Pre-Commit Checklist](./docs/references/CHECKLIST.md)** - Run before every commit
- **[Task-to-Docs Mapping](./docs/TASK-TO-DOCS-MAPPING.md)** - Quick lookup: "working on X? read Y"
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Backend API reference

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.1 (App Router) + React 19.2.0
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm 10.17.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand + React Query (TanStack Query v5)
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl (default: Vietnamese)
- **Notifications**: Sonner

**Full tech stack details**: [Getting Started](./docs/guides/00-GETTING-STARTED.md)

---

## ⚠️ Critical Rules

**Before writing ANY code, read these:**

1. **i18n**: ALL user-facing text MUST use `useTranslations()` - NO hardcoded strings
   - Read: [i18n Guide](./docs/guides/06-I18N-GUIDE.md)

2. **SEO**: Use centralized SEO configuration - NO hardcoded metadata
   - Read: [SEO Guide](./docs/guides/07-SEO-METADATA.md)

3. **TypeScript**: NO `any` types - Use proper types everywhere
   - Read: [Coding Standards](./docs/references/CODING-STANDARDS.md)

**Pre-commit checklist**: [CHECKLIST.md](./docs/references/CHECKLIST.md)

---

## 📂 Project Structure

```
manga-reader-sd/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (manga)/           # Manga browsing & reading
│   └── (user)/            # User profile & library
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── manga/             # Manga-specific components
│   └── auth/              # Auth forms & components
├── lib/
│   ├── api/               # API client & endpoints
│   ├── store/             # Zustand stores
│   ├── seo/               # SEO configuration
│   └── validators/        # Zod schemas
├── docs/                  # 📚 Complete documentation
│   ├── guides/            # Development guides (00-09)
│   └── references/        # Quick references
├── messages/              # i18n translations
└── types/                 # TypeScript types
```

**Detailed architecture**: [Project Architecture](./docs/guides/01-PROJECT-ARCHITECTURE.md)

---

## 🎯 Common Commands

```bash
# Development
pnpm dev                               # Start dev server
pnpm build                             # Build for production
pnpm lint                              # Run ESLint
pnpm type-check                        # TypeScript type check

# Adding Components
pnpm dlx shadcn@latest add button      # Add shadcn/ui component
pnpm dlx shadcn@latest add             # List all available
```

---

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1

---

## 📖 Learning Path

**New to the project?** Follow this order:

1. [Getting Started](./docs/guides/00-GETTING-STARTED.md) - Setup & tech stack
2. [Project Architecture](./docs/guides/01-PROJECT-ARCHITECTURE.md) - Folder structure
3. [i18n Guide](./docs/guides/06-I18N-GUIDE.md) - Translation rules (CRITICAL)
4. [Coding Standards](./docs/references/CODING-STANDARDS.md) - Conventions
5. [Examples](./docs/references/EXAMPLES.md) - Good files to study

**Then use** [Task-to-Docs Mapping](./docs/TASK-TO-DOCS-MAPPING.md) for specific tasks.

---

## 🤝 Contributing

Before committing:

1. ✅ Read the [Pre-Commit Checklist](./docs/references/CHECKLIST.md)
2. ✅ Verify i18n compliance (NO hardcoded text)
3. ✅ Run `pnpm type-check` and `pnpm lint`
4. ✅ Use Conventional Commits format

**Detailed guidelines**: [Coding Standards](./docs/references/CODING-STANDARDS.md)

---

**For complete documentation, visit [/docs/README.md](./docs/README.md)**
