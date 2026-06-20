# Reference – Structure and flow

Supporting document for the `dotnet-backend-clean-architecture` skill. Generic reference for the Clean Architecture + CQRS pattern described in the skill.

## Projects and responsibilities

| Project | When to use |
|---------|-------------|
| **Interface** | New endpoints = controller or methods; delegate to MediatR. |
| **Application** | New operation = folder in `Features/<Feature>/Commands/` or `Queries/`. |
| **Domain** | New entity = `Entities/` + interfaces (repository, UnitOfWork, services). |
| **Infrastructure** | EF Map, repository, UnitOfWork; only project with EF Core. |
| **CrossCutting** | Shared DTOs, options, helpers. |
| **CrossCutting.IOC** | DI: Options, DbContext, MediatR, Repository, UnitOfWork, Services, Integration, Validator, HealthChecks. |
| **Migration** | SQL schema change = new **FluentMigrator** migration. |
| **Tests** | Handler + validator tests mirroring Application. |

## Request flow (example: create product)

1. **Interface:** `ProductsController` → `_mediator.Send(new CreateProductCommand(...))`.
2. **Application:** `CreateProductHandler` → `ValidateAndThrowAsync` → UoW/repository/external service.
3. **Domain:** contracts (`IProductRepository`, `IProductUnitOfWork`, `IExternalProductService`).
4. **Infrastructure:** `ProductRepository` persists via EF Core.
5. **CrossCutting:** `ProductDto` in the response.

## Products feature (full reference)

### Application

| Type | Folder | Files |
|------|-------|----------|
| Command | CreateProduct | Command, Handler, Validator |
| Command | UpdateProduct | Command, Handler, Validator |
| Command | DeleteProduct | Command, Handler |
| Query | GetProductById | Query, Handler |
| Query | ListProducts | Query, Handler |
| Query | ListExternalProducts | Query, Handler |

### Tests (17 tests)

| Type | Files |
|------|----------|
| Handler | Create, Update, Delete, GetById, List, ListExternal |
| Validator | Create, Update |

Convention: handler mocks `IValidator<T>`; validator test uses real instance.

### API

| Method | Route |
|--------|------|
| GET | `/api/products` |
| GET | `/api/products/external` |
| GET | `/api/products/{id}` |
| POST | `/api/products` |
| PUT | `/api/products/{id}` |
| DELETE | `/api/products/{id}` |

## Content per project

- **Interface:** Controllers/, Program.cs, Middlewares/ (GlobalException), Extensions/ (Swagger, HealthChecks), Dockerfile.
- **Application:** Features/{Feature}/Commands|Queries/ (vertical slice).
- **Domain:** Entities/, Interfaces/, Services/ (e.g., ExternalProductService).
- **Infrastructure:** Persistence/ (AppDbContext, Map), Repositories/, UnitOfWork/.
- **CrossCutting:** Dto/, Options/, Helpers/.
- **CrossCutting.IOC:** DependencyInjection/ConfigureBindings*.cs.
- **Migration:** Program.cs, Migrations/Mig_*.cs, Dockerfile.

## Database schema (dual mechanism)

| Tool | Responsibility |
|------------|------------------|
| **FluentMigrator** | Creates/alters tables in SQL Server |
| **EF Core Map** | Maps entities at runtime |

When changing the model: update **Map** + **FluentMigrator Migration**. There are no EF Migrations in this pattern.

## HTTP integration

```txt
IExternalProductIntegration (Refit, Domain)
    ↑ AddRefitClient + AddStandardResilienceHandler (IOC)
ExternalProductService (Domain)
    ↑ IExternalProductService
ListExternalProductsHandler / CreateProductHandler (Application)
```

Config: `ExternalProductApi:BaseUrl`.

## Base interfaces

- **IEntity&lt;TKey&gt;:** `TKey Id { get; set; }`.
- **ICrudRepository&lt;T, TKey&gt;:** async CRUD (GetById, List, Add, Update, Delete, …).
- **I{X}UnitOfWork:** aggregation repositories + `SaveChangesAsync`.

## Configuration (API)

| Key | Values | Usage |
|-------|---------|-----|
| `Database:Provider` | `InMemory`, `SqlServer` | EF provider |
| `ConnectionStrings:Default` | SQL Server | When SqlServer |
| `ExternalProductApi:BaseUrl` | Absolute URL | Refit |

Default dev: InMemory + FakeStore (`https://fakestoreapi.com`).

Local ports (launchSettings): HTTPS **5001**, HTTP **5000**, Swagger at `/swagger`.

## Deploy

```bash
# at backend solution root
docker build -t {app}-api:latest -f {Prefix}.Interface/Dockerfile .
docker build -t {app}-migration:latest -f {Prefix}.Migration/Dockerfile .
```

K8s: manifests in `deploy/` (e.g., `api.yaml`, `migration.yaml`).

## Code quality

- `.editorconfig` at solution root
- `dotnet format {Solution}.sln` — formatting and usings
- `dotnet test {Solution}.sln` — tests per feature in `{Prefix}.Tests/Features/`

## Common architectural debt

| Item | Note |
|------|------|
| Domain → CrossCutting + Refit | Conscious debt; ideally move integration DTOs and Refit contracts to Application/Infrastructure |
| EF Map + FluentMigrator | Keep synchronized manually |
| Migration Release/Docker | Migration `appsettings.json` only copied in Debug — adjust before container deploy |
| Entity→Dto mapping | Repeated in handlers; candidate for helper or extension in the future |

Keeping the **Features** structure allows scaling without mixing layers.
