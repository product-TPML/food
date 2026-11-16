# Architecture: Food section (DH and PV)

Plain HTML, CSS and JavaScript, following the sibling Dasara and Deepawali projects. No framework, no build step, no dependencies. Pages load JSON with `fetch`, so they must be served over HTTP (for example `python -c "import http.server;http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler,port=8765)"`), not opened from `file://`.

## Pages
| File | Purpose |
|---|---|
| `index.html` | DH landing (English). `<body class="brand-dh">`. |
| `index.pv.html` | PV landing (Kannada). `<body class="brand-pv">`. |
| `story.html` | Placeholder story page (`?id=<story id>&b=dh|pv`): photo hero, reading column with drop cap and pull quote, full-width photo break, recipe callout (opens `recipe.html`), share row, reading-progress bar, related-stories row. |
| `section.html` | "See all" page (`?m=<module id>&t=<tab id>&b=dh|pv`): every story in one city tab. |
| `recipe.html` | Step-by-step recipe view and recipe chooser, each with an English / ಕನ್ನಡ switch (`&lang=en|kn`; story pages open recipes in their own page language). Takes `?id=<recipe id>` or `?story=<story id>`; no parameters lists every draft. Has the same black nav strip and photo masthead as the other pages. |

Both landings point `data-layout` at the same file, `content/placeholder-landing.json`; story and section pages read it too. Text language follows `<html lang>` (`kn` on PV); on story and section pages the `&b=` parameter sets brand, language and colours. Every card, headline and "See all" link is a real link: cards open `story.html`, city links open `section.html`, recipe callouts open `recipe.html`.

## Scripts (`site/`)
- `common.js`: shared helpers on `window.Food` (`el`, `imageUrl`, `formatDate`, `loadJson`, `loadRecipes`, `picture`, `authorLine`, `plainText`). `loadRecipes` reads `content/recipe-index.json` and merges every listed draft file.
- `cards.js`: shared builders (`Cards.create(data)`): photo frame, kicker, meta, card, portrait/glass card, rail, and URL helpers (`storyUrl`, `sectionUrl`, `recipeUrl`). Used by `main.js` and `story.js`.
- `parallax.js`: scroll parallax shared by every page (vertical photo drift, sideways drift inside carousels, masthead photo; cards themselves never move). Skipped for reduced motion.
- `recipe-view.js`: recipe rendering shared by `recipe.html` and story pages (`RecipeView.method` = ingredient grid / nested boxes / list with toggle and print; `RecipeView.card` = the inline recipe card).
- `story.js`: renders `story.html` and `section.html`. Story hero: the whole photo (never cropped, fitted inside the hero with a blurred copy behind) sits in a fixed layer; the headline scrolls up and the opaque article (`.story-after`) slides over it. A story with a recipe shows the recipe card inline and a "Jump to recipe" button in the hero.
- `main.js`: landing renderer. Builds modules from the layout JSON: `lead` (hero), `split` (big card with a frosted-glass text panel beside a rail), `portrait` (2:3 cards with text on a gradient), `glass` (4:5 cards with a frosted, square-edged text panel), `cards`, `tabs` (city pill tabs with ARIA tablist and arrow-key support), `list`. Card rails are grids on desktop and scroll-snap carousels below 1024px. Sets the masthead photo from `mastheadImage`.
- `recipe.js`: recipe renderer. Lays the ingredient/operation tree out as a spanning-cell grid (desktop), nested boxes (phones) and a numbered list; also the chooser.

## Styles (`site/style.css`)
One stylesheet. Brand tokens on `:root` and `.brand-pv`: DH `#0091AC` / highlight `#EE9B00`, PV `#B82831` / highlight `#F08C44` (Common Design style guide). Fonts: Bricolage Grotesque (headlines), Inter (text), Noto Sans Kannada fallback for Kannada glyphs; loaded from Google Fonts in each page head. Derived tints (`--band`, `--chip-bg`, `--accent-ink`) are computed on `body` so each brand uses its own primary. Image placeholders use `.art` with per-card aspect-ratio classes `.ar-*`. Logos are the approved assets in `site/assets/`.

## Content (`content/`)
Source snapshots, editorial selections, placeholders and recipe drafts are kept separate.
- `dh-api-snapshot.json`, `pv-api-snapshot.json`, `pv-recipe-sources.json`: fetched Quintype API responses (research record; never edited).
- `landing-shortlist.json`: editorial shortlist of real stories (metadata, image keys). Currently used only as the source of placeholder photo keys.
- `landing-dh.json`, `landing-pv.json`: earlier real-story placements. Not used by the pages now; kept so the real layout can be restored.
- `placeholder-landing.json`: the live content for landing, story and section pages. Placeholder stories (English and Kannada, some with a `recipe` id that links to a real recipe draft), shared article text (`article`), modules, UI strings, image tones, masthead image key. Same stories on DH and PV. Photos are borrowed from the shortlist and their rights are unchecked.
- `tabular-recipe-drafts.json` and `recipe-drafts/*.json` (33 drafts in total), listed in `recipe-index.json`. Each draft is in its source language (4 English from DH, 29 Kannada from PV).
- `recipe-i18n/*.json`: the other language for every draft (English for the PV recipes, Kannada for the DH ones), keyed by recipe id: `{lang, title, ingredients:{key:text}, actions:{opId:text}}`. Listed under `translations` in `recipe-index.json`; `Food.loadRecipes` attaches them as `recipe.i18n[lang]` and `Food.localise(recipe, lang)` returns the translated view only when every ingredient and step is covered. Source drafts are never edited. Translations are unapproved working copies: every number was checked against the source, wording was not editor-reviewed. Each recipe is an ingredient list plus an operation tree; every ingredient and every result is consumed by exactly one later operation, with one final operation. Quantities are verbatim from the source story; gaps and conflicts are recorded in `editorialQuestions`.

## Docs
`PLAN.md` (plan and research), `STYLE_RESEARCH.md` (landing styling references and picks), `TABULAR_RECIPES.md` (human-readable recipe drafts).

## Not built yet
Deployment, CMS integration and canonical URLs, live API fetching, real ad integration, image rights and delivery checks, publisher approval of the recipe drafts. Pages are `noindex` previews.
