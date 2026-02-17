# maurao-skills

Repositório de skills para uso com agentes (Codex, Cursor, etc.) via ecossistema [skills.sh](https://skills.sh).

## Skills disponíveis

| Skill | Descrição |
|-------|-----------|
| [dotnet-backend-clean-architecture](skills/dotnet-backend-clean-architecture/) | Clean Architecture + CQRS (MediatR) para backends .NET: vertical slice, Commands/Queries, handlers, validators, repositórios. |

## Como instalar

Requisito: [Node.js](https://nodejs.org/) (para usar `npx`).

### Listar skills do repositório

```bash
npx skills add luismpenholato/maurao-skills --list
```

### Instalar um skill

```bash
npx skills add luismpenholato/maurao-skills --skill dotnet-backend-clean-architecture
```

Para instalar globalmente e/ou em um agente específico, use as flags indicadas pelo CLI (ex.: `--global`, `--agent`).

### Ver no skills.sh

- **Repositório:** [skills.sh/luismpenholato/maurao-skills](https://skills.sh/luismpenholato/maurao-skills)
- **Skill .NET:** [skills.sh/luismpenholato/maurao-skills/dotnet-backend-clean-architecture](https://skills.sh/luismpenholato/maurao-skills/dotnet-backend-clean-architecture)

## Estrutura do repositório

```
maurao-skills/
  skills/
    dotnet-backend-clean-architecture/
      SKILL.md
      reference.md
```

Cada skill fica em uma pasta com `SKILL.md` (frontmatter YAML + instruções). Arquivos em `reference.md` ou `references/` são opcionais.

## Licença

[MIT](LICENSE) — livre para uso, modificação e distribuição. Só mantenha o aviso de copyright e da licença.
