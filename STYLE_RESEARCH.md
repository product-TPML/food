# Landing-page styling research
Date: 16 November 2026. Scope: layout and visual treatment only. Fonts and brand colours stay as in the Common Design style guide (decided by the user).

Method: each site was loaded in a headless browser at 1280px and 390px (mobile emulation) and captured or inspected through the DOM. Cookie dialogs were not accepted; where one covered the page, findings come from the DOM and are marked.

## Findings

### Serious Eats (seriouseats.com) — seen on screen, desktop and mobile
- Desktop hero: full-bleed photo with a white text card overlapping the lower left (category label, headline, dek, byline).
- Below it: lead story (about 780px wide) beside a rail of rows. Each row has the label and time on one line, headline, byline, and a small thumbnail on the right. Hairline dividers, no boxes.
- Mobile: full-width image, then label, large headline, dek, byline. Then a "The Latest" list of rows with text on the left and a small thumbnail (about 96px wide) on the right.
- Small uppercase, letter-spaced labels. Very little decoration; whitespace does the work.
- Strength: the clearest reading order on a phone. Weakness: little visual personality beyond the photos.

### Bon Appétit (bonappetit.com) — seen on screen, desktop and mobile
- Desktop hero: split layout. Large photo on the left half, centred label, big condensed headline and dek on the right.
- Beside the hero, a narrow rail of stacked items with text left, thumbnail right and an uppercase byline.
- Modules have large uppercase section titles ("THANKSGIVING", "NEWEST RECIPES") above a big image with a text column, then rows of four cards. Some rows are horizontal carousels.
- Recipe cards carry time and rating beside the headline.
- Mobile: hero text is centred above the image; sections stack.
- Strength: the strongest magazine feel, with clear module identity. Weakness: carousels hide content, and the page is long and ad-heavy.

### Good Food (bbcgoodfood.com/recipes) — DOM only (consent dialog covered the page)
- Module order: Recipe inspiration, most popular collections, latest videos, browse by category, seasonal inspiration, trending guides, latest recipes.
- Card images about 269x244 (near square); the lead is a portrait image (370x481). A "Premium" badge sits on cards. 21 carousel elements on the page.
- Serif display headlines with a sans body.
- Strength: practical browse-by-category and collections. Weakness: carousel-led, so discovery depends on swiping. Not seen visually.

### The Guardian Food (theguardian.com/food) — DOM and top of mobile page (consent dialog covered the rest)
- Mobile top: serif headline, coloured kicker line above it ("Curry or beans?"), a 1.25:1 image, then lists with small thumbnails (123x98).
- Kicker plus headline pairs name the series or column, which gives editorial voice.
- Strength: few modules and strong typographic hierarchy. Not seen visually beyond the first screen.

### NYT Cooking (cooking.nytimes.com) — not usable
- A consent dialog blocked the page and my DOM inspection failed. No findings recorded.

### Hebbars Kitchen (hebbarskitchen.com) — seen on screen, mobile only (an Indian recipe site, for contrast)
- Headlines sit on top of photos, truncated with "..." and clipped by the edge, with a second copy of the title baked into the picture.
- Peeking horizontal carousel; ads between nearly every module.
- Lesson: avoid text over busy photos, truncated or clipped titles, and carousels as the main path. Matches the plan's own warnings.

### Not reviewed
- The Hindu: access failed earlier and was not retried.
- Cooking for Engineers: a recipe-grid reference, already used for the recipe page.

## Comparison for our needs
| Need | Best reference | Why |
|---|---|---|
| Phone reading order | Serious Eats | image, label, headline, dek; then text-left, thumbnail-right rows |
| Desktop lead | Serious Eats (card overlapping the photo) with a rail of rows | focal lead, then a scannable rail |
| Magazine feel and module identity | Bon Appétit | strong section titles and varied module shapes |
| Editorial voice | Guardian | kicker label above the headline |
| Avoid | Hebbars, carousel-led pages | clipped titles, hidden content |

## Decisions
Applied to both DH and PV. Fonts and brand colours unchanged.

Desktop (1024px and up):
1. Lead: large photo with the headline card overlapping its lower edge (Serious Eats). Rail beside it uses hairline rows with text left and a small thumbnail right.
2. Modules: bold section titles, with alternate modules on a full-width brand-tinted band for rhythm (Bon Appétit).
3. Cards stay in 3 or 4 column grids. No carousels.

Mobile (under 640px):
1. Lead: full-width image, then label, headline, dek (Serious Eats).
2. In every module the first story is a full-width card; the rest become compact rows with text left and a 3:2 thumbnail right.
3. Headlines clamp at 3 lines. No text over photos. No carousels. Tinted bands carry over.

Tablet: two columns, same card style as desktop.

Constraints kept: strict 3:2 images, hero headline larger than other headlines, date at the right of each card's meta row, reserved ad slots between modules, native Kannada text, no invented recipe data.
