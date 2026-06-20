# Maurao Skills

Reusable AI agent skills for software engineering, architecture, automation, and developer workflows.

Companion to the [CleanStack](https://github.com/luismpenholato/clean-stack) fullstack starter (`.NET`, Angular, React/Next.js).

## Available skills

| Skill | Description |
|-------|-------------|
| [dotnet-backend-clean-architecture](skills/dotnet-backend-clean-architecture/) | Backend architecture and implementation guidance for .NET APIs. |
| [angular-frontend-clean-architecture](skills/angular-frontend-clean-architecture/) | Frontend architecture and implementation guidance for Angular applications. |
| [react-nextjs-antd-clean-architecture](skills/react-nextjs-antd-clean-architecture/) | Frontend architecture and implementation guidance for React, Next.js, and Ant Design applications. |

## How to install

Requirement: [Node.js](https://nodejs.org/) (to use `npx`).

### List skills in the repository

```bash
npx skills add luismpenholato/maurao-skills --list
```

### Install a skill

```bash
# .NET backend
npx skills add luismpenholato/maurao-skills --skill dotnet-backend-clean-architecture

# Angular frontend
npx skills add luismpenholato/maurao-skills --skill angular-frontend-clean-architecture

# React + Next.js frontend
npx skills add luismpenholato/maurao-skills --skill react-nextjs-antd-clean-architecture
```

To install globally and/or for a specific agent, use the flags shown by the CLI (e.g., `--global`, `--agent`).

Installation is done directly from this GitHub repository; [skills.sh](https://skills.sh) may have its own catalog/indexing and not every public repo appears there.

## Repository structure

```
maurao-skills/
  skills/
    dotnet-backend-clean-architecture/
      SKILL.md
      reference.md
    angular-frontend-clean-architecture/
      SKILL.md
      reference.md
    react-nextjs-antd-clean-architecture/
      SKILL.md
      reference.md
```

Each skill lives in a folder with `SKILL.md` (YAML frontmatter + instructions). Files in `reference.md` or `references/` are optional.

## Community

| Document | Description |
|-----------|-------------|
| [Contributing](CONTRIBUTING.md) | How to add or change skills |
| [Security](SECURITY.md) | Report malicious or unsafe content |
| [License](LICENSE) | MIT License |

## License

[MIT](LICENSE) — free to use, modify, and distribute. Keep the copyright and license notice.
