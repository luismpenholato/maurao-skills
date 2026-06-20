---
name: react-nextjs-antd-clean-architecture
description: React 19 + Next.js 16 App Router, TypeScript, Ant Design, TanStack Query, Axios, React Hook Form, Zod — Clean Architecture frontend with vertical slice by feature. Use when creating or refactoring Next.js apps, admin panels, SaaS frontends, CRUDs, forms, layouts and frontend architecture.
---

# React 19 + Next.js 16 + Ant Design — Clean Architecture

Skill for creating and maintaining React 19 + Next.js 16 frontends with feature architecture, Ant Design, and REST integration (.NET or similar).

## When to use

- Create or extend Next.js frontend (admin, SaaS, backoffice)
- CRUD, forms, authenticated layout
- Integrate with REST API
- Refactor React components to vertical slice
- Define service, hook, schema, and route patterns

## Expected structure

```txt
src/app/           → routes, layouts, loading, error, not-found (NO business logic)
src/features/      → domains (auth, products, …)
src/shared/        → components, providers, lib (api, auth, env), theme/
```

## UI URLs vs API

| Layer | Convention | Example |
|---|---|---|
| UI routes | English | `/products`, `/products/new`, `/products/:id/edit` |
| REST API | English | `/api/products` |

## Architecture rules

1. `src/app` — Next.js only (thin routes importing pages from `features/`)
2. `src/features/{domain}/` — types, schemas, services, hooks, components, `{domain}.page.tsx`
3. `src/shared/` — reusable, **no** domain logic
4. HTTP centralized in `shared/lib/api/api-client.ts`
5. `process.env` only in `shared/lib/env/env.ts`
6. Forms: **React Hook Form + Zod**
7. Remote state: **TanStack Query**
8. UI: **Ant Design** (no Tailwind in MVP)
9. Design system in `shared/theme/` — palette, CSS tokens, overrides in `theme/styles/antd/`
10. Drawer/menu: `rootClassName="app-drawer"` + CSS `.app-drawer .drawer-menu` (portaled to body)
11. SEO: `shared/lib/seo/metadata.ts` + metadata per route; `noindex` in admin app
12. Forbidden: `any`, Axios directly in visual components; legacy redirects without need

## Ant Design + App Router

```tsx
// src/app/layout.tsx
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
```

Separate provider with `ConfigProvider`, `en_US` locale, centralized theme.

## Server vs Client Components

| `'use client'` | Server Component |
|---|---|
| Interactive Ant Design | Route that only re-exports feature page |
| useRouter, useState, useEffect | redirect(), metadata |
| TanStack Query, React Hook Form | Layout without interactivity |
| localStorage, events | — |

## Service pattern

```ts
import { apiClient } from '@/shared/lib/api/api-client';

export async function listProducts(): Promise<Product[]> {
  return apiClient.get<Product[]>('/api/products');
}
```

- Services are pure async functions
- **Must not** use hooks or JSX

## Hook pattern

```ts
'use client';

import { useQuery } from '@tanstack/react-query';

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: listProducts });
}
```

- Hooks **must not** return JSX
- Mutations invalidate related query keys

## Form pattern

```ts
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  price: z.number().positive('Price must be greater than zero.'),
});
```

Component: `useForm` + `zodResolver` + `Controller` + Ant Design `Form.Item`.

## Test conventions

- Test Zod schemas with `safeParse` (Vitest)
- File: `{feature}.schema.test.ts` next to the schema
- Do not test Ant Design internal implementation
- Prefer contract tests (schema, mocked service) over UI snapshots

## New feature — checklist

1. types → 2. schema (+ test) → 3. service → 4. hooks → 5. components → 6. page → 7. route in app/

## Reference

Detailed examples in [`reference.md`](reference.md).
