// Smooth scroll for nav links
document.querySelectorAll('.nav a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Load and render bibliography from publications.json (generated from publications.bib)
const listEl = document.getElementById('publications-list');
const loadingEl = document.getElementById('pub-loading');
if (listEl && loadingEl) {
  fetch('/publications.json')
    .then((r) => (r.ok ? r.json() : []))
    .then((entries) => {
      loadingEl.hidden = true;
      if (!entries.length) return;
      listEl.hidden = false;
      listEl.innerHTML = entries
        .map(
          (p) => `
          <li class="pub-item">
            <span class="pub-title">${escapeHtml(p.title)}</span>
            <span class="pub-authors">${escapeHtml(p.authors)}</span>
            <span class="pub-venue">${escapeHtml(p.venue)}</span>
            <span class="pub-links">${renderLinks(p)}</span>
          </li>`
        )
        .join('');
    })
    .catch(() => {
      loadingEl.textContent = 'Publications could not be loaded. Run: node scripts/bib-to-json.js';
    });
}

function escapeHtml(s) {
  if (!s) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function renderLinks(p) {
  const links = [];
  if (p.pdf) links.push(`<a href="${escapeHtml(p.pdf)}">PDF</a>`);
  if (p.website) links.push(`<a href="${escapeHtml(p.website)}">Website</a>`);
  if (p.code) links.push(`<a href="${escapeHtml(p.code)}">Code</a>`);
  return links.join(' ');
}
