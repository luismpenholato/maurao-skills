# Referência – Estrutura e fluxo

## Projetos e responsabilidades

| Projeto | Quando usar |
|---------|--------------|
| **Interface** | Novos endpoints = novo controller ou novos métodos; delegar para MediatR. |
| **Application** | Nova operação = nova pasta em Commands ou Queries dentro de `Features/<Feature>/`. |
| **Domain** | Nova entidade = classe em Entities + interfaces em Interfaces (repositório, UnitOfWork, serviços). |
| **Infrastructure** | Nova entidade = config em Persistence/Map, repositório em Repositories, UnitOfWork. |
| **CrossCutting** | Novo DTO ou opção compartilhada = Dto/ ou Options/. |
| **CrossCutting.IOC** | Novo serviço/repositório = novo ou existente `ConfigureBindings*.cs`. |
| **Migration** | Alteração de modelo = nova migration. |
| **Tests** | Novo handler/comando/query = testes em Features/ espelhando a Application. |

## Fluxo de uma requisição (ex.: criar produto)

1. **Interface:** `ProductsController` recebe o request e envia `CreateProductCommand` via MediatR.
2. **Application:** `CreateProductHandler` processa o comando, usa `IProductRepository`/UnitOfWork (contratos do Domain).
3. **Domain:** define `Product`, `IProductRepository`, `IProductUnitOfWork`.
4. **Infrastructure:** implementa `ProductRepository` e persistência com EF Core.
5. **CrossCutting:** DTOs (ex.: `ProductDto`) usados na API e nos handlers.

## Conteúdo por projeto

- **Interface:** Controllers/, Program.cs, appsettings, Extensions (Swagger), Middlewares (ex.: GlobalException).
- **Application:** Features/{Feature}/Commands/{CommandName}/ (Command, Handler, Validator), Queries/{QueryName}/ (Query, Handler).
- **Domain:** Entities/, Interfaces/ (Entities, Repositories, UnitOfWork, Services, Integration), Services/ (implementações em domínio quando fizer sentido).
- **Infrastructure:** Persistence/ (DbContext, Map), Repositories/, UnitOfWork/.
- **CrossCutting:** Dto/, Options/, Helpers/.
- **CrossCutting.IOC:** DependencyInjection/ com ConfigureBindings* (Options, DatabaseContext, MediatR, Repository, UnitOfWork, Services, Integration, Validator, HealthChecks).

## Interfaces base

- **IEntity&lt;TKey&gt;:** contrato para entidades com `TKey Id { get; set; }`.
- **ICrudRepository&lt;T, TKey&gt;:** GetByIdAsync, GetByIdTrackingAsync, ListAsync, AddAsync, AddRangeAsync, UpdateAsync, UpdateRangeAsync, DeleteAsync, DeleteRangeAsync (T : IEntity&lt;TKey&gt;, TKey : IEquatable&lt;TKey&gt;).
- Repositório específico: `IProductRepository : ICrudRepository<Product, long>`.
- UnitOfWork: interface com repositórios da agregação e `SaveChangesAsync`.

Manter essa estrutura permite escalar com novas features (nova pasta em Application + Domain + Infrastructure + testes) sem misturar responsabilidades entre camadas.
