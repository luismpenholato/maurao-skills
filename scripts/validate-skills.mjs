#!/usr/bin/env node
/**
 * Validates Maurao Skills repository structure and content.
 *
 * YAML frontmatter parsing is intentionally limited to simple key: value pairs
 * used in this repository (name, description). Complex YAML features are not supported.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = join(ROOT, 'skills');

const errors = [];
const warnings = [];

function error(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function parseSimpleFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return { frontmatter: null, body: content };
  }

  const frontmatter = {};
  const lines = match[1].split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(`Invalid frontmatter line: "${line}"`);
    }

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  const body = content.slice(match[0].length).trim();
  return { frontmatter, body };
}

function extractMarkdownLinks(content) {
  const links = [];
  const linkRegex = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({ text: match[1], target: match[2], index: match.index });
  }

  return links;
}

function isExternalLink(target) {
  return /^(https?:|mailto:|#)/i.test(target);
}

async function fileExists(path) {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch {
    return false;
  }
}

async function isEmptyFile(path) {
  const content = await readFile(path, 'utf8');
  return content.trim().length === 0;
}

async function validateMarkdownLinks(filePath, content) {
  const links = extractMarkdownLinks(content);
  const fileDir = dirname(filePath);

  for (const link of links) {
    const target = link.target.trim();

    if (isExternalLink(target)) continue;

    const [pathPart] = target.split('#');
    if (!pathPart) continue;

    const resolved = isAbsolute(pathPart)
      ? pathPart
      : resolve(fileDir, pathPart);

    if (!(await fileExists(resolved))) {
      error(
        `Broken local link in ${relative(ROOT, filePath)}: [${link.text}](${target}) → ${relative(ROOT, resolved)}`
      );
    }
  }
}

async function validateSkillDirectory(skillPath, folderName, seenNames) {
  const skillMdPath = join(skillPath, 'SKILL.md');

  if (!(await fileExists(skillMdPath))) {
    error(`Missing SKILL.md in skills/${folderName}/`);
    return;
  }

  const skillContent = await readFile(skillMdPath, 'utf8');

  let frontmatter;
  let body;

  try {
    ({ frontmatter, body } = parseSimpleFrontmatter(skillContent));
  } catch (err) {
    error(`Invalid frontmatter in skills/${folderName}/SKILL.md: ${err.message}`);
    return;
  }

  if (!frontmatter) {
    error(`Missing YAML frontmatter in skills/${folderName}/SKILL.md`);
    return;
  }

  if (!frontmatter.name) {
    error(`Missing "name" in frontmatter of skills/${folderName}/SKILL.md`);
  } else {
    if (frontmatter.name !== folderName) {
      error(
        `Frontmatter name "${frontmatter.name}" does not match folder name "${folderName}"`
      );
    }

    if (seenNames.has(frontmatter.name)) {
      error(`Duplicate skill name "${frontmatter.name}"`);
    } else {
      seenNames.add(frontmatter.name);
    }
  }

  if (!frontmatter.description || !frontmatter.description.trim()) {
    error(`Missing or empty "description" in skills/${folderName}/SKILL.md`);
  }

  if (!body) {
    error(`SKILL.md has no content after frontmatter in skills/${folderName}/`);
  }

  await validateMarkdownLinks(skillMdPath, skillContent);

  const referencePath = join(skillPath, 'reference.md');
  if (await fileExists(referencePath)) {
    const referenceContent = await readFile(referencePath, 'utf8');
    await validateMarkdownLinks(referencePath, referenceContent);
  }

  const entries = await readdir(skillPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const filePath = join(skillPath, entry.name);
    if (await isEmptyFile(filePath)) {
      warn(`Empty file: ${relative(ROOT, filePath)}`);
    }
  }
}

async function main() {
  let skillEntries;

  try {
    skillEntries = await readdir(SKILLS_DIR, { withFileTypes: true });
  } catch {
    error('skills/ directory not found');
    printResults();
    process.exit(1);
  }

  const skillDirs = skillEntries.filter((entry) => entry.isDirectory());

  if (skillDirs.length === 0) {
    error('No skill directories found in skills/');
  }

  const seenNames = new Set();

  for (const dir of skillDirs.sort((a, b) => a.name.localeCompare(b.name))) {
    await validateSkillDirectory(join(SKILLS_DIR, dir.name), dir.name, seenNames);
  }

  printResults();
  process.exit(errors.length > 0 ? 1 : 0);
}

function printResults() {
  console.log('');
  console.log('Maurao Skills — validation report');
  console.log('=================================');
  console.log('');

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const message of warnings) {
      console.log(`  ⚠ ${message}`);
    }
    console.log('');
  }

  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    for (const message of errors) {
      console.log(`  ✗ ${message}`);
    }
    console.log('');
    console.log('Validation failed.');
    return;
  }

  if (warnings.length === 0) {
    console.log('All checks passed.');
  } else {
    console.log('Validation passed with warnings.');
  }
}

main().catch((err) => {
  console.error('Unexpected validation error:', err);
  process.exit(1);
});
