# Manga Reader CMS - Documentation

**Complete development guide for the Manga Reader CMS project**

---

## 🚀 Quick Start

**New to the project?** Start here:

1. **[Getting Started](./guides/00-GETTING-STARTED.md)** - Installation, tech stack, setup
2. **[Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md)** - Codebase structure
3. **[i18n Guide](./guides/06-I18N-GUIDE.md)** - ⚠️ CRITICAL - Translation rules (MUST READ)
4. **[Coding Standards](./references/CODING-STANDARDS.md)** - Conventions and rules
5. **[Examples](./references/EXAMPLES.md)** - Good files to study

---

## 📚 Development Guides

### Core Guides (Read in Order)

| #   | Guide                                                              | Description                                  |
| --- | ------------------------------------------------------------------ | -------------------------------------------- |
| 00  | **[Getting Started](./guides/00-GETTING-STARTED.md)**              | Installation, tech stack, workflow           |
| 01  | **[Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md)**    | Folder structure, routing, conventions       |
| 02  | **[Component Patterns](./guides/02-COMPONENT-PATTERNS.md)**        | Server/Client split, import order, structure |
| 03  | **[State Management](./guides/03-STATE-MANAGEMENT.md)**            | useState, React Query, Zustand               |
| 04  | **[API Integration](./guides/04-API-INTEGRATION.md)**              | Backend integration, React Query             |
| 05  | **[Forms & Validation](./guides/05-FORMS-VALIDATION.md)**          | React Hook Form + Zod                        |
| 06  | **[i18n Guide](./guides/06-I18N-GUIDE.md)**                        | ⚠️ **CRITICAL** - Translations (MANDATORY)   |
| 07  | **[SEO & Metadata](./guides/07-SEO-METADATA.md)**                  | Centralized SEO, JSON-LD schemas             |
| 08  | **[UI Components](./guides/08-UI-COMPONENTS.md)**                  | shadcn/ui usage, styling                     |
| 09  | **[Next.js Best Practices](./guides/09-NEXTJS-BEST-PRACTICES.md)** | Image, Link, optimization                    |

---

## 📖 Reference Documentation

### Quick References

| Reference                                                | Description                                        |
| -------------------------------------------------------- | -------------------------------------------------- |
| **[Coding Standards](./references/CODING-STANDARDS.md)** | Naming, TypeScript, Git conventions                |
| **[Checklist](./references/CHECKLIST.md)**               | Pre-commit verification (run before every commit!) |
| **[Anti-Patterns](./references/ANTI-PATTERNS.md)**       | What NOT to do + files needing fixes               |
| **[Examples](./references/EXAMPLES.md)**                 | Good reference files to study                      |
| **[Task-to-Docs Mapping](./TASK-TO-DOCS-MAPPING.md)**    | Quick lookup: "working on X? read Y"               |

---

## 🔍 Find Documentation by Task

**Looking for help with a specific task?** Use the [Task-to-Docs Mapping](./TASK-TO-DOCS-MAPPING.md) for instant navigation.

**Common scenarios:**

- **Creating a new component** → [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) + [i18n Guide](./guides/06-I18N-GUIDE.md)
- **Working with forms** → [Forms & Validation](./guides/05-FORMS-VALIDATION.md)
- **API integration** → [API Integration](./guides/04-API-INTEGRATION.md) + [State Management](./guides/03-STATE-MANAGEMENT.md)
- **Adding a new page** → [Component Patterns](./guides/02-COMPONENT-PATTERNS.md) + [SEO & Metadata](./guides/07-SEO-METADATA.md)
- **Before committing** → [Checklist](./references/CHECKLIST.md)

---

## ⚠️ Critical Rules (Always Follow)

### 1. i18n - ALL Text Must Be Translated

**NEVER hardcode strings** - Use `useTranslations()` for ALL user-facing text

```tsx
// ✅ CORRECT
const t = useTranslations('namespace')
<button>{t('save')}</button>

// ❌ WRONG
<button>Save</button>
<button>Lưu</button>
```

**Read**: [i18n Guide](./guides/06-I18N-GUIDE.md) (MANDATORY)

---

### 2. SEO - Use Centralized Configuration

**NEVER hardcode metadata** - Use config and generator functions

```tsx
// ✅ CORRECT
import { defaultMetadata } from "@/lib/seo/config";
export const metadata = defaultMetadata;

// ❌ WRONG
export const metadata = { title: "My Page" };
```

**Read**: [SEO & Metadata](./guides/07-SEO-METADATA.md)

---

### 3. TypeScript - NO `any` Types

**Always use proper types** - Prefer `unknown` over `any`

```tsx
// ✅ CORRECT
import type { User } from "@/types/user";
function handleError(error: unknown) {}

// ❌ WRONG
function handleSubmit(data: any) {}
```

**Read**: [Coding Standards](./references/CODING-STANDARDS.md)

---

## 📦 Tech Stack Summary

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5+
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm 10.17.1
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand + React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **i18n**: next-intl (default: Vietnamese)
- **Notifications**: Sonner

**Full details**: [Getting Started](./guides/00-GETTING-STARTED.md)

---

## 🔗 Project URLs

- **Backend API**: `http://localhost:8000/api/v1`
- **Frontend**: `http://localhost:3000`
- **API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Project Roadmap**: [ROADMAP.md](./ROADMAP.md)
- **Project Overview**: [project-overview-pdr.md](./project-overview-pdr.md)

---

## 🎯 Documentation Structure

```
docs/
├── README.md                          # This file - master index
├── TASK-TO-DOCS-MAPPING.md           # Quick task lookup
│
├── guides/                            # Step-by-step development guides
│   ├── 00-GETTING-STARTED.md
│   ├── 01-PROJECT-ARCHITECTURE.md
│   ├── 02-COMPONENT-PATTERNS.md
│   ├── 03-STATE-MANAGEMENT.md
│   ├── 04-API-INTEGRATION.md
│   ├── 05-FORMS-VALIDATION.md
│   ├── 06-I18N-GUIDE.md              # ⚠️ CRITICAL
│   ├── 07-SEO-METADATA.md
│   ├── 08-UI-COMPONENTS.md
│   └── 09-NEXTJS-BEST-PRACTICES.md
│
├── references/                        # Quick reference docs
│   ├── CODING-STANDARDS.md
│   ├── CHECKLIST.md
│   ├── ANTI-PATTERNS.md
│   └── EXAMPLES.md
│
├── API_DOCUMENTATION.md               # Backend API reference
├── ROADMAP.md                         # Project phases and progress
└── project-overview-pdr.md            # Project overview
```

---

## 🛠️ Common Commands

```bash
# Development
pnpm dev                               # Start dev server
pnpm build                             # Build for production
pnpm lint                              # Run ESLint
pnpm type-check                        # TypeScript check

# Adding Components
pnpm dlx shadcn@latest add button      # Add shadcn/ui component
pnpm dlx shadcn@latest add             # List all available components
```

---

## 📝 Before Every Commit

**Run the checklist**: [Pre-Commit Checklist](./references/CHECKLIST.md)

**Minimum checks:**

- [ ] ALL text uses `useTranslations()` - NO hardcoded strings
- [ ] Using centralized SEO config - NO hardcoded metadata
- [ ] NO `any` types - Proper TypeScript everywhere
- [ ] Files follow naming conventions
- [ ] Git commit follows Conventional Commits format

---

## 🆘 Need Help?

### By Task Type

See [Task-to-Docs Mapping](./TASK-TO-DOCS-MAPPING.md) for instant help based on what you're working on.

### By Topic

| Topic                | Guide                                                       |
| -------------------- | ----------------------------------------------------------- |
| Setup & Installation | [Getting Started](./guides/00-GETTING-STARTED.md)           |
| Folder Structure     | [Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md) |
| Components           | [Component Patterns](./guides/02-COMPONENT-PATTERNS.md)     |
| Forms                | [Forms & Validation](./guides/05-FORMS-VALIDATION.md)       |
| Translations         | [i18n Guide](./guides/06-I18N-GUIDE.md)                     |
| SEO                  | [SEO & Metadata](./guides/07-SEO-METADATA.md)               |
| Styling              | [UI Components](./guides/08-UI-COMPONENTS.md)               |
| API Calls            | [API Integration](./guides/04-API-INTEGRATION.md)           |
| State Management     | [State Management](./guides/03-STATE-MANAGEMENT.md)         |

### Learning Path

**First-time contributors:**

1. [Getting Started](./guides/00-GETTING-STARTED.md)
2. [Project Architecture](./guides/01-PROJECT-ARCHITECTURE.md)
3. [i18n Guide](./guides/06-I18N-GUIDE.md) - **CRITICAL**
4. [Coding Standards](./references/CODING-STANDARDS.md)
5. [Examples](./references/EXAMPLES.md)
6. [Checklist](./references/CHECKLIST.md)

**Then pick guides based on your task** using [Task-to-Docs Mapping](./TASK-TO-DOCS-MAPPING.md).

---

## 🔄 Documentation Updates

This documentation was restructured on **2025-11-15** to improve navigation and accessibility.

**Previous documentation**: `CLAUDE.md` (archived)

**Changes:**

- Split monolithic CLAUDE.md into focused, task-oriented guides
- Added quick reference documents
- Created task-to-docs mapping for faster navigation
- Improved cross-referencing between documents

---

## 📧 Feedback

Found an issue with the documentation? Create a GitHub issue or update the docs directly!

---

**Last updated**: 2025-11-15
