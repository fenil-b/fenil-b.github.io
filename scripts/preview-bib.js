#!/usr/bin/env node
/**
 * Preview parsed BibTeX: read from a file or stdin and print JSON.
 * Usage:
 *   node scripts/preview-bib.js                    # read from stdin
 *   node scripts/preview-bib.js path/to/entry.bib # read from file
 * Paste one or more BibTeX entries to see how they will appear in publications.json.
 */

import fs from 'fs';
import { bibToEntries } from './lib/bib-parse.js';

const src = process.argv[2]
  ? fs.readFileSync(process.argv[2], 'utf8')
  : await new Promise((resolve, reject) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => { data += chunk; });
      process.stdin.on('end', () => resolve(data));
      process.stdin.on('error', reject);
    });

const entries = bibToEntries(src);
console.log(JSON.stringify(entries, null, 2));
