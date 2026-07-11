# Reference – Structure and flow

Supporting document for the `angular-frontend-clean-architecture` skill.

## Folders and responsibilities

| Folder / file | When to use |
|-----------------|-------------|
| **layout/** | Shell (header, menu, drawer, router-outlet). |
| **pages/\<feature\>/** | New area = new folder (model, service, screens). |
| **shared/components/** | Generic UI (page-header, loading, loading-overlay, splash-screen). |
| **shared/directives/** | Reusable behavior (autofocus, currency-mask). |
| **shared/pipes/** | Template transformation (truncate). |
| **shared/services/** | Global state (loading, layout, confirmation). |
| **shared/guards/** | `CanActivateFn` (auth, roles). |
| **shared/interceptors/** | Global HTTP (error, token). |
| **shared/utils/** | Pure functions (error parser). |
| **src/styles/** | Design system: `--app-*` tokens, ng-zorro overrides. |
| **src/environments/** | `apiBaseUrl` per environment. |
| **app.routes.ts** | Routes and guards. |

## Screen flow (example: list products)

1. **Routes:** products listing — `path: 'products'` → `ProductsListComponent`, `canActivate: [authGuard]`.
2. **Component:** `inject(ProductService)`, signals (`loading`, `items`), `computed` for filters.
3. **Service:** `http.get<Product[]>(baseUrl)`.
4. **Template:** `@if (loading())` → spinner; `@else` → `@for (item of items(); track item.id)`.

## Content per folder

- **layout/main-layout:** header, drawer, `<router-outlet>`; may use `LayoutService`.
- **pages/\<feature\>:** `*.model.ts`, `*.service.ts`, `*-list/`, `*-form/` (component + html + scss + spec).
- **shared/components:** one directory per component.
- **shared/directives:** one directory per directive; `host` + `input()`.
- **shared/interceptors:** `HttpInterceptorFn` or class interceptor.

## Environment and API

```typescript
// src/environments/environment.development.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000',
};
```

Services: `` `${environment.apiBaseUrl}/api/<resource>` ``.

## Routes (CRUD pattern)

| Screen | UI path |
|------|--------|
| Listing | `products` |
| Create | `products/new` |
| Edit | `products/:id/edit` |

REST API: `/api/products`. Drawer menu: **Products** item → `/products`.

## Drawer and theme

- Drawer: `nzWrapClassName="app-drawer"`, content in `*nzDrawerContent`.
- Side menu: `.drawer-menu` with global CSS `.app-drawer .drawer-menu` (drawer portaled to `body`).
- Light/dark theme: `LayoutService` + `body.theme-dark` + `_tokens.scss`.

## SEO (basic)

- `index.html`: meta description, Open Graph, `noindex` (admin app)
- `app.routes.ts`: `title` + `data.description` per route
- `AppTitleStrategy`: updates `<title>` and meta tags on each navigation

## Tests

- Runner: `ng test` (Vitest integrated with Angular CLI).
- Specs next to the file: `*.component.spec.ts`, `*.service.spec.ts`.
- Do not test ng-zorro internal implementation — focus on component/service logic.

## Deploy (optional)

```bash
docker build -t {app}-frontend:latest .
docker run -p 80:80 {app}-frontend:latest
```

Multi-stage pattern: Node build + nginx.

## Common errors

| Error | Fix |
|------|----------|
| Business logic in `app.routes.ts` | Move to `pages/` |
| Hardcoded API URL | Use `environment.apiBaseUrl` |
| `@Input()` in new code | Prefer `input()` |
| `ngClass` / `ngStyle` | Use `[class.x]` / `[style.x]` |
| Entire feature in `shared/` | Domain stays in `pages/` |
| CSS `.app-main-layout .drawer-menu` has no effect | Drawer portaled — use `.app-drawer .drawer-menu` |

Keeping **pages/** per feature and **shared/** only for reusable code avoids coupling and scales well.
