# Portfolio (source)

Personal portfolio site — **this repository is the development source only.** The live site is published by deploying **only the build output** to the `fenil-b.github.io` repo, so that repo does not contain source code or project structure and is not intended to be cloned and reused as a template.

## Setup

```bash
npm install
```

Add your profile photo as `public/prof_pic.jpg`. Update contact links (email, Google Scholar, LinkedIn, CV) in `index.html`.

## Bibliography

Publications are driven by **`publications.bib`**. Paste BibTeX entries there (no need to edit `index.html` for each paper).

- **PDF link:** use `url = {https://...pdf...}` in the BibTeX entry.
- **Extra links:** optional `website = {https://...}` and `code = {https://...}`.
- **Order:** first entry in the file = top of the list (most recent first).

After editing `publications.bib`, run:

```bash
npm run bib
```

Then refresh the site (or run `npm run dev` and open [preview-bib.html](http://localhost:5173/preview-bib.html) to preview the list only).

To preview a single BibTeX entry before adding it to the file:

```bash
node scripts/preview-bib.js path/to/entry.bib
# or paste into stdin:
echo '@inproceedings{...}' | node scripts/preview-bib.js
```

`npm run build` runs the bib script automatically, so the built site always has an up-to-date `publications.json`.

## Develop

```bash
npm run dev
```

Open the local URL (e.g. http://localhost:5173).

## Build

```bash
npm run build
```

Output goes to `dist/` (HTML, CSS, JS, and assets). Do **not** push this project’s source (e.g. `src/`, `package.json`, this README) to the GitHub Pages repo.

## Deploy to GitHub Pages

1. Clone the **Pages repo** (e.g. `fenil-b/fenil-b.github.io`) into a separate directory, for example:
   ```bash
   git clone https://github.com/fenil-b/fenil-b.github.io.git ../fenil-b.github.io
   ```

2. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```
   Or set the deploy target and run:
   ```bash
   DEPLOY_TARGET=../fenil-b.github.io node scripts/deploy.js
   ```
   Or: `node scripts/deploy.js /path/to/fenil-b.github.io`

3. The deploy script copies the contents of `dist/` into the Pages clone and stages changes. In that clone, commit and push:
   ```bash
   cd ../fenil-b.github.io
   git commit -m "Deploy"
   git push
   ```

The **fenil-b.github.io** repo should contain **only** the built files (`index.html`, `assets/`, images). It must **not** contain `package.json`, `src/`, `vite.config.js`, or any other source so that the repo does not expose the full project or serve as a clonable template.

## Tech

- [Vite](https://vitejs.dev/) (vanilla HTML/JS/CSS), single-page layout.
