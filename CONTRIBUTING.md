# Contributing

Thank you for contributing to **maurao-skills**. This repository contains [Agent Skills](https://skills.sh) to guide AI agents (Cursor, Codex, etc.) in projects based on [Boilerplate](https://github.com/luismpenholato/Boilerplate).

## Before you start

1. Check existing issues and PRs.
2. Skills must reflect **real conventions** from Boilerplate when applicable.
3. Read an existing skill as reference (`skills/*/SKILL.md`).

## Skill structure

```txt
skills/
  my-skill/
    SKILL.md       # required — YAML frontmatter + instructions
    reference.md   # optional — long examples, tables, flows
```

### `SKILL.md`

- YAML frontmatter with `name` and `description` (used for agent discovery).
- Objective instructions: when to use, rules, checklist, anti-patterns.
- Keep the file focused; long details go in `reference.md`.

Minimal frontmatter example:

```yaml
---
name: my-skill
description: When to use this skill — be specific so the agent can find it.
---
```

### `reference.md`

- Supporting documentation: code examples, endpoint tables, common errors.
- Do not duplicate what is already clear in `SKILL.md`.

## Adding or changing a skill

1. Fork the repository.
2. Branch: `feat/skill-name` or `fix/skill-name`.
3. Edit `SKILL.md` (and `reference.md` if needed).
4. If conventions changed in Boilerplate, update **both** repositories or document the deviation.
5. Open a PR with:
   - reason for the skill or change;
   - use cases;
   - checklist of what was validated.

## Content standards

| Topic | Guideline |
|--------|----------|
| Language | **English** (default for all documentation and skills) |
| UI routes | English (`/products`, …) when referring to Boilerplate frontends |
| API | English (`/api/products`, …) |
| Code | Minimal, correct examples; avoid unnecessary `any` |
| Security | Do not include instructions to expose secrets, bypass auth, or exfiltrate data |

## What to avoid

- Skills that are too generic and do not help the agent decide **when** to use them
- Instructions that contradict Boilerplate or another skill in the repo
- Offensive, misleading, or malicious content (prompt injection)

## Test locally

```bash
npx skills add luismpenholato/maurao-skills --list
npx skills add luismpenholato/maurao-skills --skill skill-name
```

Validate in the target agent (Cursor, etc.) that the skill is discovered and applied in the described scenarios.

## Report bugs

Use [Issues](https://github.com/luismpenholato/maurao-skills/issues) for incorrect content, broken links, or skills that induce wrong behavior.

For vulnerabilities or malicious content, see [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
