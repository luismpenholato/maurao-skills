# Reference — React 19 + Next.js 16 + Ant Design

## Responsibilities per folder

| Folder | Responsibility |
|---|---|
| `src/app` | Routes, layouts, loading, error, not-found |
| `src/features` | Domains and screens (vertical slice) |
| `src/shared/components` | Reusable UI (layout, page-header, errors) |
| `src/shared/lib/api` | Axios client, ApiError, interceptors |
| `src/shared/lib/auth` | JWT token (localStorage in MVP) |
| `src/shared/lib/env` | Typed environment variables |
| `src/shared/lib/seo` | SEO metadata (`createPageMetadata`, `robots.ts`, `sitemap.ts`) |
| `src/shared/providers` | AntdProvider, QueryProvider, AppProviders |
| `src/shared/theme` | Design system: palette, antd-config, CSS in `theme/styles/` |

## Full CRUD flow

```
src/app/(private)/products/page.tsx     → import { ProductsPage } from '@/features/...'
src/features/products/products.page.tsx → orchestrates hooks + components
src/features/products/hooks/use-products.ts
src/features/products/services/product.service.ts
src/shared/lib/api/api-client.ts      → GET /api/products
```

## Example: thin route

```tsx
// src/app/(private)/products/page.tsx
import { ProductsPage } from '@/features/products/products.page';
import { createPageMetadata } from '@/shared/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Products',
  description: 'Manage your product catalog.',
});

export default function Page() {
  return <ProductsPage />;
}
```

## SEO (basic)

| Piece | Role |
|---|---|
| `shared/lib/seo/metadata.ts` | `rootMetadata`, `createPageMetadata`, `siteUrl` |
| `app/layout.tsx` | Global metadata + `noindex` (admin app) |
| Routes | `export const metadata` or `generateMetadata` |
| `app/robots.ts` / `app/sitemap.ts` | Crawlers and sitemap |

Env: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_NAME`.

## Example: mutation hook

```ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
```

## Example: form with Ant Design

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Input, Button } from 'antd';
import { Controller, useForm } from 'react-hook-form';

export function ProductForm({ onSubmit }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: 0 },
  });

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item label="Name" validateStatus={errors.name ? 'error' : undefined} help={errors.name?.message}>
        <Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>
      <Button type="primary" htmlType="submit">Save</Button>
    </Form>
  );
}
```

## Example: schema test

```ts
import { describe, expect, it } from 'vitest';
import { productSchema } from './product.schema';

describe('productSchema', () => {
  it('rejects empty name', () => {
    const result = productSchema.safeParse({ name: '', price: 10, active: true });
    expect(result.success).toBe(false);
  });
});
```

## Example: api-client with JWT

```ts
instance.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## Example: typed env

```ts
export const env = {
  apiBaseUrl: getRequiredEnv('NEXT_PUBLIC_API_BASE_URL'),
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'My App',
};
```

## Naming conventions

| Type | Pattern |
|---|---|
| Folders/files | kebab-case |
| React components | PascalCase |
| Hooks | `useName` |
| Services | `{feature}.service.ts` |
| Schemas | `{feature}.schema.ts` |
| Feature pages | `{feature}.page.tsx` |

## When to use Client Component

- Interactive Ant Design (Form, Table, Modal, Menu)
- `useRouter`, `usePathname`
- TanStack Query (`useQuery`, `useMutation`)
- React Hook Form
- `localStorage` / `sessionStorage`

## Common errors

| Error | Fix |
|---|---|
| Business logic in `app/page.tsx` | Move to `features/` |
| Axios in component | Extract to `service` |
| Scattered `process.env` | Centralize in `shared/lib/env` |
| Ant Design without registry | Add `AntdRegistry` in layout |
| Tailwind + AntD mixed | Choose one design system |
| `z.coerce.number()` + Zod 4 + RHF | Prefer `z.number()` with InputNumber |
| Menu CSS only in layout CSS Module | Drawer portaled to body — use `.app-drawer .drawer-menu` |
| Margin/gap on Ant Design 6 `style`/`styles` props | Spacing between siblings: `gap` on parent HTML container |

## Useful commands

```bash
npm run dev
npm run lint
npm run test
npm run build
cp .env.example .env.local
```

## Integration with .NET backend

Typical contracts:

- `POST /api/auth/login` → `{ accessToken, expiresIn }`
- `GET/POST/PUT/DELETE /api/products` → CRUD with JSON DTOs

Services should mirror backend endpoints without duplicating business logic.
