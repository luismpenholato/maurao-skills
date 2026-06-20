---
name: angular-frontend-clean-architecture
description: Angular 21 standalone frontend with Clean Architecture, vertical slice (pages by feature), signals, OnPush, and ng-zorro. Use when creating or refactoring Angular apps, adding pages, components, services, directives, pipes, or when the user mentions Angular frontend, standalone components, or signals.
---

# Frontend Angular – Clean Architecture + Standalone

Guide for creating and maintaining Angular frontends with **features** structure (vertical slice), standalone components, signals, and ng-zorro-antd.

## When to use this skill

- Add a new **page/feature** (new folder in `pages/` with listing, form, service, models).
- Create **component** in `shared/components/`, **directive** in `shared/directives/`, **pipe** in `shared/pipes/`.
- Add **service** (HTTP, global state), **guard**, **interceptor**.
- Define or change **routes** in `app.routes.ts`.
- Review or refactor code to follow this skill's pattern.

## Target stack

| Technology | Usage |
|---|---|
| Angular 21 | Standalone, signals, `@if` / `@for` |
| ng-zorro-antd 21 | UI (tables, forms, layout) |
| RxJS 7 | HTTP and streams |
| TypeScript 5.9 | Typing |
| Vitest 4 | Tests via `ng test` |

## Project structure

```txt
src/
├── app/
│   ├── app.ts                    # Root (layout + overlays)
│   ├── app.config.ts             # provideRouter, provideHttpClient, …
│   ├── app.routes.ts             # Routes and guards
│   ├── layout/
│   │   └── main-layout/
│   ├── pages/                    # Features (vertical slice)
│   │   └── products/
│   │       ├── product.model.ts
│   │       ├── product.service.ts
│   │       ├── products-list/
│   │       └── product-form/
│   └── shared/
│       ├── components/           # page-header, loading, …
│       ├── directives/           # autofocus, currency-mask, …
│       ├── guards/               # authGuard (CanActivateFn)
│       ├── interceptors/
│       ├── pipes/
│       ├── services/             # loading, layout, confirmation
│       └── utils/
├── environments/                 # apiBaseUrl per environment
└── styles/                       # _tokens.scss, _ng-zorro-overrides.scss
```

Rule: **pages/** = one folder per domain; inside it model, service, and **one subfolder per screen**. **shared/** = only what is reusable across features.

## Checklist – New feature (e.g., Orders)

**Model and service**

- [ ] `pages/orders/order.model.ts`: interfaces (`Order`, `OrderCreateRequest`, …).
- [ ] `pages/orders/order.service.ts`: `@Injectable({ providedIn: 'root' })`, `inject(HttpClient)`, `Observable` methods. Base: `` `${environment.apiBaseUrl}/api/orders` ``.

**Screens**

- [ ] One folder per screen (`orders-list/`, `order-form/`) with `*.component.ts/html/scss/spec`.
- [ ] `ChangeDetectionStrategy.OnPush`, `host: { class: 'app-orders-list' }`, signals/computed.
- [ ] Template: `@if` / `@for` with `track`; no `ngClass`/`ngStyle`.

**Routes**

- [ ] `app.routes.ts`: feature routes; `canActivate: [authGuard]` when needed.

**Shared (only if reusable)**

- [ ] Component/directive/pipe in `shared/` only when used in more than one feature.

## Code patterns

**Standalone component (Angular 21 pattern — no `standalone: true`)**

```typescript
@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-page-header' },
  imports: [RouterLink, NzBreadCrumbModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  title = input.required<string>();
}
```

**Service with HttpClient**

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/products`;

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
}
```

**Guard**

```typescript
export const authGuard: CanActivateFn = () => true; // replace with real auth
```

## Conventions

- **Components:** OnPush, `host: { class: 'app-<name>' }`, `input()`/`output()` with signals.
- **Templates:** `@if`, `@for`, `@switch`; stable `track` in `@for`.
- **Services:** `inject()`; `providedIn: 'root'` for globals.
- **Routes:** `app.routes.ts`; guards in `shared/guards/`. UI path segments in **English** (`products`, `new`, `edit`); API at `/api/products`.
- **Environment:** `src/environments/` — never hardcode API URL in components.
- **Theme:** `src/styles/_tokens.scss` + `_ng-zorro-overrides.scss`; toggle via `LayoutService` (`body.theme-dark`).
- **Drawer/menu:** `nzWrapClassName="app-drawer"`, `*nzDrawerContent`, CSS `.app-drawer .drawer-menu` (portaled to body).
- **SEO:** `title` + `data.description` on routes; `AppTitleStrategy`; `noindex` in `index.html` (admin app).
- **Names:** kebab-case in folders/files; `app` prefix on selectors.

## Error handling and loading

- HTTP: `catchError`, `finalize`, `timeout`; feedback via `NzMessageService`.
- Loading: signal in component or `LoadingService` / global overlay in `shared/services/`.
- Global errors: interceptor in `shared/interceptors/`.

## Additional resources

- Detailed structure and data flow: [reference.md](reference.md).
