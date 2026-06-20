# Security policy

## Scope

This repository distributes **documentation and instructions** (Agent Skills) for AI tools. It does not run code on its own servers or process end-user data.

Relevant risks:

| Type | Description |
|------|-------------|
| Malicious content | Skill instructions that induce secret leakage or destructive actions |
| Incorrect information | Guidance that leads to insecure code in the user's project |
| Dependencies | External tools (`npx skills`, agents) — see provider policies |

## Supported versions

Security content fixes apply to the main branch (`main`) and the latest version published on GitHub.

## Report a vulnerability

**Do not** open a public issue for:

- skills with malicious instructions or deliberate prompt injection;
- examples that encourage committing secrets or bypassing authentication;
- any content that could compromise repositories or environments of skill users.

### How to report

1. **[GitHub Security Advisories](https://github.com/luismpenholato/maurao-skills/security/advisories/new)** (recommended)
2. Private contact with the maintainer, if an agreed channel exists

### Include in the report

- Skill path (`skills/.../SKILL.md`)
- Problematic excerpt and expected impact
- Suggested fix (optional)

## Response time (target)

| Stage | Target timeline |
|-------|-------------------|
| Confirmation | 3 business days |
| Triage | 7 business days |
| Fix or content removal | based on severity |

## Safe use of skills

- Review skills before installing in corporate environments.
- Do not paste secrets, `.env`, or tokens in prompts.
- Keep skills updated from this repository or an audited fork.
- Combine skills with human review on AI-generated code PRs.

We appreciate responsible reports.
