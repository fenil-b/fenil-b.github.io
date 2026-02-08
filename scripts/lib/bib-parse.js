/**
 * Parse BibTeX content into publication entries.
 * Supports: title, author, year, booktitle, journal, url (PDF), website, code.
 */

function stripBraces(s) {
  return s.replace(/^\{|\}$/g, '').trim();
}

function cleanValue(s) {
  return s
    .replace(/\s+/g, ' ')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\{\\/g, '')
    .replace(/\\([a-z]+)\s*\{([^}]*)\}/gi, '$2')
    .trim();
}

function parseFieldValue(str, start) {
  const open = str.indexOf('{', start);
  if (open === -1) return { value: '', end: start };
  let depth = 1;
  let i = open + 1;
  while (i < str.length && depth > 0) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') depth--;
    i++;
  }
  const raw = str.slice(open + 1, i - 1);
  return { value: cleanValue(raw.replace(/\n/g, ' ')), end: i };
}

function parseEntryBlock(block) {
  const fields = {};
  const keyMatch = block.match(/^@\w+\s*\{\s*[^,]+,\s*/);
  if (!keyMatch) return null;
  let rest = block.slice(keyMatch[0].length);
  const keyRe = /(\w+)\s*=\s*(\{|")/g;
  let m;
  while ((m = keyRe.exec(rest)) !== null) {
    const key = m[1].toLowerCase();
    const braceStart = m.index + m[0].indexOf('{');
    const quoteStart = m.index + m[0].length;
    if (m[2] === '{') {
      const { value, end } = parseFieldValue(rest, braceStart);
      fields[key] = value;
      rest = rest.slice(end);
      keyRe.lastIndex = 0;
    } else {
      const close = rest.indexOf('"', quoteStart);
      if (close !== -1) {
        fields[key] = cleanValue(rest.slice(quoteStart, close));
        rest = rest.slice(close + 1);
        keyRe.lastIndex = 0;
      }
    }
  }
  return fields;
}

function findMatchingBrace(str, from) {
  let depth = 0;
  for (let i = from; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

export function bibToEntries(bibContent) {
  const entries = [];
  let i = 0;
  while (i < bibContent.length) {
    const at = bibContent.indexOf('@', i);
    if (at === -1) break;
    const typeMatch = bibContent.slice(at).match(/^@(\w+)\s*\{/);
    if (!typeMatch) { i = at + 1; continue; }
    const openBrace = at + typeMatch[0].length - 1;
    const closeBrace = findMatchingBrace(bibContent, openBrace);
    if (closeBrace === -1) break;
    const block = bibContent.slice(at, closeBrace + 1);
    const fields = parseEntryBlock(block);
    if (fields && fields.title) {
      const venue = fields.booktitle || fields.journal || fields.venue || fields.year || '';
      entries.push({
        title: stripBraces(fields.title),
        authors: (fields.author || '').replace(/\s+and\s+/g, ', '),
        venue: cleanValue(venue),
        year: fields.year || '',
        pdf: fields.url || null,
        website: fields.website || null,
        code: fields.code || null,
      });
    }
    i = closeBrace + 1;
  }
  return entries;
}
