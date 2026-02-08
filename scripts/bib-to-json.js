#!/usr/bin/env node
/**
 * Parse publications.bib and write public/publications.json.
 * Run before build so the site can load the bibliography.
 *
 * Supports: title, author, year, booktitle, journal, url (PDF), website, code.
 * Order in .bib = order in list (first entry = top).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { bibToEntries } from './lib/bib-parse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const bibPath = path.join(rootDir, 'publications.bib');
const outPath = path.join(rootDir, 'public', 'publications.json');

const bib = fs.readFileSync(bibPath, 'utf8');
const entries = bibToEntries(bib);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), 'utf8');
console.log('Wrote', entries.length, 'publications to', outPath);
