# Architecture: Food section (DH and PV)

Plain HTML, CSS and JavaScript, following the sibling Dasara and Deepawali projects. No framework, no build step, no dependencies. Pages load JSON with `fetch`, so they must be served over HTTP (for example `python -c "import http.server;http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler,port=8765)"`), not opened from `file://`.

## Pages
| File | Purpose |
|---|---|
| `index.html` | DH landing (English). `<body class="brand-dh">`. |
| `index.pv.html` | PV landing (Kannada). `<body class="brand-pv">`. |
| `recipe.html` | Step-by-step recipe view and recipe chooser. Takes `?id=<recipe id>` or `?story=<story id>`; no parameters lists every draft. |

Both landings point `data-layout` at the same file, `content/placeholder-landing.json`. Text language follows `<html lang>`.

## Scripts (`site/`)
- `common.js`: shared helpers on `window.Food` (`el`, `imageUrl`, `formatDate`, `loadJson`, `loadRecipes`, `picture`, `authorLine`, `plainText`). `loadRecipes` reads `content/recipe-index.json` and merges every listed draft file.
- `main.js`: landing renderer. Builds modules from the layout JSON: `lead` (hero), `split`, `portrait` (2:3 cards with text on a gradient), `cards`, `tabs` (city pill tabs with ARIA tablist and arrow-key support), `list`. Card rails are grids on desktop and scroll-snap carousels below 1024px. Sets the masthead photo from `mastheadImage`. Placeholder links are inert (`data-placeholder`).
- `recipe.js`: recipe renderer. Lays the ingredient/operation tree out as a spanning-cell grid (desktop), nested boxes (phones) and a numbered list; also the chooser.

## Styles (`site/style.css`)
One stylesheet. Brand tokens on `:root` and `.brand-pv`: DH `#0091AC` / highlight `#EE9B00`, PV `#B82831` / highlight `#F08C44` (Common Design style guide). Fonts: Bricolage Grotesque (headlines), Inter (text), Noto Sans Kannada fallback for Kannada glyphs; loaded from Google Fonts in each page head. Derived tints (`--band`, `--chip-bg`, `--accent-ink`) are computed on `body` so each brand uses its own primary. Image placeholders use `.art` with per-card aspect-ratio classes `.ar-*`. Logos are the approved assets in `site/assets/`.

## Content (`content/`)
Source snapshots, editorial selections, placeholders and recipe drafts are kept separate.
- `dh-api-snapshot.json`, `pv-api-snapshot.json`, `pv-recipe-sources.json`: fetched Quintype API responses (research record; never edited).
- `landing-shortlist.json`: editorial shortlist of real stories (metadata, image keys). Currently used only as the source of placeholder photo keys.
- `landing-dh.json`, `landing-pv.json`: earlier real-story placements. Not used by the pages now; kept so the real layout can be restored.
- `placeholder-landing.json`: the live landing content. Placeholder stories (English and Kannada), modules, UI strings, image tones, masthead image key. Same stories on DH and PV. Photos are borrowed from the shortlist and their rights are unchecked.
- `tabular-recipe-drafts.json` and `recipe-drafts/*.json` (33 drafts in total), listed in `recipe-index.json`. Each recipe is an ingredient list plus an operation tree; every ingredient and every result is consumed by exactly one later operation, with one final operation. Quantities are verbatim from the source story; gaps and conflicts are recorded in `editorialQuestions`.

## Docs
`PLAN.md` (plan and research), `STYLE_RESEARCH.md` (landing styling references and picks), `TABULAR_RECIPES.md` (human-readable recipe drafts).

## Not built yet
Deployment, CMS integration and canonical URLs, live API fetching, real ad integration, image rights and delivery checks, publisher approval of the recipe drafts. Pages are `noindex` previews.
