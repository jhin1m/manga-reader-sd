# Pre-Commit Checklist

**Verify your code meets all requirements before committing**

---

## ⚠️ CRITICAL - i18n (Internationalization)

**These are MANDATORY - Never skip!**

- [ ] **NO hardcoded strings** in JSX (`<h1>`, `<p>`, `<button>`, etc.)
- [ ] All user-facing text uses `useTranslations()`
- [ ] All button labels use `t('key')`
- [ ] All form labels use `t('key')`
- [ ] All placeholders use `t('key')`
- [ ] All error messages use `t('key')`
- [ ] All success messages use `t('key')`
- [ ] Translations added to `messages/vi.json`
- [ ] Organized into appropriate namespace

**Reference**: [i18n Guide](../guides/06-I18N-GUIDE.md)

---

## SEO & Metadata

- [ ] **Static pages**: Using `defaultMetadata` from `lib/seo/config.ts`
- [ ] **Dynamic pages**: Using generator functions from `lib/seo/metadata.ts`
- [ ] **NO hardcoded metadata** in pages
- [ ] JSON-LD schemas added for structured data
- [ ] Canonical URLs set
- [ ] OG images optimized and accessible

**Reference**: [SEO Guide](../guides/07-SEO-METADATA.md)

---

## Component Patterns

- [ ] **Server/Client split** correct (`"use client"` only when needed)
- [ ] Imports in **standard order** (React → External → Next.js → Internal → UI → Utils)
- [ ] Component has **JSDoc comment**
- [ ] Props interface defined with TypeScript
- [ ] Early returns for loading/error states
- [ ] Using Next.js `<Image>` instead of `<img>`
- [ ] Using Next.js `<Link>` instead of `<a>` for internal links

**Reference**: [Component Patterns](../guides/02-COMPONENT-PATTERNS.md)

---

## TypeScript

- [ ] **NO `any` types** anywhere
- [ ] Explicit **return types** for functions
- [ ] Type-only imports use `import type { ... }`
- [ ] Props interfaces defined
- [ ] API response types defined
- [ ] Prefer `unknown` over `any` for errors

**Reference**: [Coding Standards](./CODING-STANDARDS.md)

---

## File Naming & Organization

- [ ] Components: `kebab-case.tsx`
- [ ] Hooks: `use-*.ts`
- [ ] Stores: `camelCaseStore.ts`
- [ ] Single responsibility per file
- [ ] Helpers in `/lib/utils.ts`, **NOT in component files**
- [ ] API endpoints in `/lib/api/endpoints/`
- [ ] Validators in `/lib/validators/`

**Reference**: [Project Architecture](../guides/01-PROJECT-ARCHITECTURE.md)

---

## State Management

- [ ] **Local UI state**: Using `useState`
- [ ] **Server data**: Using React Query (`useQuery`/`useMutation`)
- [ ] **Global state**: Using Zustand stores
- [ ] React Query keys are **consistent and hierarchical**
- [ ] Optimistic updates where appropriate
- [ ] Error handling in mutations

**Reference**: [State Management](../guides/03-STATE-MANAGEMENT.md)

---

## API Integration

- [ ] API functions in `lib/api/endpoints/`
- [ ] **Type-only imports** for API types
- [ ] Using `apiClient` from `lib/api/client.ts`
- [ ] Proper error handling
- [ ] Loading states handled
- [ ] Toast notifications for success/error

**Reference**: [API Integration](../guides/04-API-INTEGRATION.md)

---

## Forms & Validation

- [ ] Zod schema defined in `lib/validators/`
- [ ] Using React Hook Form with `zodResolver`
- [ ] Form fields use shadcn/ui `<FormField>`
- [ ] **All labels translated** with `useTranslations()`
- [ ] Error messages display via `<FormMessage>`
- [ ] Submit button disabled during loading
- [ ] Success/error feedback with toast

**Reference**: [Forms & Validation](../guides/05-FORMS-VALIDATION.md)

---

## UI Components

- [ ] Using **shadcn/ui components** from `@/components/ui/`
- [ ] **NEVER modified** `components/ui/` files directly
- [ ] Custom components wrap shadcn/ui components
- [ ] Using `cn()` for conditional classes
- [ ] Responsive classes added (`md:`, `lg:`)
- [ ] Accessible labels and ARIA attributes
- [ ] Toast notifications use Sonner

**Reference**: [UI Components](../guides/08-UI-COMPONENTS.md)

---

## Next.js Best Practices

- [ ] Images use `<Image>` component with `fill` and `sizes`
- [ ] Links use `<Link>` component
- [ ] Loading states: `loading.tsx` or Suspense
- [ ] Error handling: `error.tsx` or error boundaries
- [ ] Proper caching strategy (`revalidate`, `cache`)
- [ ] Parallel data fetching with `Promise.all()`

**Reference**: [Next.js Best Practices](../guides/09-NEXTJS-BEST-PRACTICES.md)

---

## Code Quality

- [ ] **JSDoc comments** for public functions/components
- [ ] Inline comments explain **WHY**, not WHAT
- [ ] **NO TODO comments** (create GitHub issues instead)
- [ ] **NO commented-out code**
- [ ] Proper error handling (try-catch, error boundaries)
- [ ] Consistent code formatting

**Reference**: [Coding Standards](./CODING-STANDARDS.md)

---

## Git

- [ ] Commit message follows **Conventional Commits** format
- [ ] Commit type correct (`feat:`, `fix:`, `refactor:`, etc.)
- [ ] Commit description clear and concise
- [ ] Related files grouped in same commit
- [ ] NO unrelated changes in one commit

**Reference**: [Coding Standards](./CODING-STANDARDS.md#git-commit-conventions)

---

## Testing (Optional but Recommended)

- [ ] Component renders without errors
- [ ] Form validation works correctly
- [ ] API calls succeed
- [ ] Error states display properly
- [ ] Loading states work
- [ ] Responsive on mobile/tablet/desktop

---

## Build & Type Check

Run these commands to verify:

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build (catches most errors)
pnpm build
```

---

## Quick Verification

### Fastest checks (do these every time):

1. **Search for hardcoded text**: `"` or `'` in JSX → Should use `t('key')`
2. **Search for `any`**: Should be `unknown` or proper type
3. **Check imports**: Types use `import type`
4. **Check file naming**: kebab-case.tsx

---

## Common Violations

### ❌ Most Common Mistakes

1. **Hardcoded text** instead of translations
2. **Using `<img>` instead of `<Image>`**
3. **Using `<a>` instead of `<Link>`**
4. **`any` types** instead of proper types
5. **Helpers in component files** instead of `lib/utils.ts`
6. **Hardcoded metadata** instead of generators
7. **TODO comments** instead of GitHub issues

**Reference**: [Anti-Patterns](./ANTI-PATTERNS.md)

---

## Before First Commit

If you're new to the project, also check:

- [ ] Read [Getting Started](../guides/00-GETTING-STARTED.md)
- [ ] Read [i18n Guide](../guides/06-I18N-GUIDE.md) (CRITICAL)
- [ ] Read [SEO Guide](../guides/07-SEO-METADATA.md)
- [ ] Study [Examples](./EXAMPLES.md)
- [ ] Review [Anti-Patterns](./ANTI-PATTERNS.md)

---

## Summary - The Absolute Essentials

**If you only check 3 things, check these:**

1. ✅ **ALL text uses translations** - `useTranslations()`, NO hardcoded strings
2. ✅ **SEO uses centralized config** - NO hardcoded metadata
3. ✅ **NO `any` types** - Proper TypeScript types everywhere

---

**Last updated**: 2025-11-15
