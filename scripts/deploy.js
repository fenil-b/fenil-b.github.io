#!/usr/bin/env node
/**
 * Deploy build output to the GitHub Pages repo (fenil-b.github.io).
 * Only the contents of dist/ are copied; the target repo must contain
 * no source files (no package.json, src/, etc.).
 *
 * Usage:
 *   1. Clone the Pages repo somewhere, e.g. ../fenil-b.github.io
 *   2. Set DEPLOY_TARGET to that path, or pass as first argument
 *   3. npm run build && npm run deploy
 *
 * Example:
 *   DEPLOY_TARGET=../fenil-b.github.io node scripts/deploy.js
 *   node scripts/deploy.js ../fenil-b.github.io
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const deployTarget = process.env.DEPLOY_TARGET || process.argv[2];
if (!deployTarget) {
  console.error('Usage: DEPLOY_TARGET=/path/to/fenil-b.github.io node scripts/deploy.js');
  console.error('   or: node scripts/deploy.js /path/to/fenil-b.github.io');
  process.exit(1);
}

const deployDir = path.resolve(path.isAbsolute(deployTarget) ? deployTarget : path.join(rootDir, deployTarget));
if (!fs.existsSync(deployDir)) {
  console.error('Deploy target directory does not exist:', deployDir);
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  console.log('Running build...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
}

if (!fs.existsSync(distDir)) {
  console.error('Build failed or dist/ missing.');
  process.exit(1);
}

// Remove everything in deploy dir except .git
const entries = fs.readdirSync(deployDir, { withFileTypes: true });
for (const ent of entries) {
  if (ent.name === '.git') continue;
  const full = path.join(deployDir, ent.name);
  if (ent.isDirectory()) {
    fs.rmSync(full, { recursive: true });
  } else {
    fs.unlinkSync(full);
  }
}

// Copy dist contents into deploy dir
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const name of fs.readdirSync(distDir)) {
  copyRecursive(path.join(distDir, name), path.join(deployDir, name));
}

console.log('Copied build output to', deployDir);

const gitDir = path.join(deployDir, '.git');
if (fs.existsSync(gitDir)) {
  try {
    execSync('git add -A', { cwd: deployDir, stdio: 'inherit' });
    execSync('git status --short', { cwd: deployDir, stdio: 'inherit' });
    console.log('Staged changes. Run "git commit -m \'Deploy\' && git push" in the deploy directory to publish.');
  } catch (e) {
    console.error('Git add failed:', e.message);
    process.exit(1);
  }
} else {
  console.log('No .git in deploy target; skipping git. Add, commit, and push manually.');
}
