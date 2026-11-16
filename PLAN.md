# Food section: plan and content research
Research date: 16 November 2026. Status: planning only; no page code built.

## Direction
Build a curated food magazine for DH and PV using current publisher content. Use the sibling Dasara/Deepawali plain HTML/CSS/JS setup and existing publisher assets. Share layout behavior and recipe data structure, with independent editorial selection and language per publication.

## Listing references
- Serious Eats — https://www.seriouseats.com/ — strongest additional reference. Desktop DOM measurements at 1280px showed a 783px lead beside a 386px supporting list. At an emulated 390px viewport, cards became 358px wide with 16px side margins; document width remained 390px. Adopt its clear lead/support hierarchy and readable mobile sequence. This was a layout/DOM check, not a complete screenshot, accessibility, or real-device audit.
- Bon Appétit — https://www.bonappetit.com/ — image-led lead, seasonal editorial grouping, recipes mixed with culture and restaurants. Useful for a magazine feel and varied modules. Page contents reviewed; mobile behavior not independently verified.
- Good Food — https://www.bbcgoodfood.com/recipes — useful recipe collections, practical browsing categories and compact time/difficulty metadata. Borrow utility only where our content has verified metadata. Page contents reviewed; mobile behavior not independently verified.
- Guardian Food — https://www.theguardian.com/food — editorial reference; Feast archive is https://www.theguardian.com/theguardian/feast. Favor a small number of strong modules over its publishing volume. Current page contents reviewed; no full mobile audit.
- Cooking for Engineers — https://www.cookingforengineers.com/recipe/58/Peanut-Butter-Cookies/4 — tabular-recipe reference, not landing-page styling.
- The Hindu — https://www.thehindu.com/food/ — access failed; no current visual assessment claimed.

Recommendation: Serious Eats lead/list hierarchy, Bon Appétit-style editorial grouping, our existing publisher typography. These are pattern references, not drop-in templates.

Styling research and picks (desktop and mobile) are in STYLE_RESEARCH.md. Fonts and brand colours follow the Common Design style guide.

## Proposed landing-page order
1. Existing publisher logo/header; food title and brief descriptor.
2. Compact navigation: Recipes, Eating out, Food stories, Kitchen know-how. PV labels need Kannada desk review.
3. One large lead with two supporting articles. On mobile: full-width lead then compact supporting rows, preserving editorial order.
4. Cook something: four recipe/watch cards. Distinguish written recipes and video-led stories visibly. Show times only if the source supplies them.
5. One regional or seasonal collection: Karnataka kitchens is an evergreen starting point.
6. Eating out: two or three guides/features.
7. Food stories: people, history and travel.
8. Latest/archive link. No endless duplicated rows.

Desktop: shared alignment grid, restrained dividers, generous images; normally 3 columns, 4 only for compact recipe cards. Tablet: 2 columns. Mobile: full-width lead and written-recipe cards; compact image/text rows for secondary news/features. Do not force long Kannada headlines into tiny two-column tiles. Avoid clipping headlines, horizontal card carousels as the sole discovery path, and typography over busy images.

Reserve explicit ad positions between modules and never split an ingredient-to-method grid with an ad. Reuse confirmed publisher ad integration later; do not copy campaign sponsor settings.

## Content gathered
- DH: 40 collection entries saved; 14 shortlisted.
- PV: 30 food and 30 recipe collection entries saved; 13 shortlisted from the recipe collection.
- All 27 shortlist candidates have hero image keys. This confirms metadata availability, not image rights, crop quality, or delivery checks.
- Full API source responses are in content/dh-api-snapshot.json and content/pv-api-snapshot.json. Three individually fetched PV recipes are in content/pv-recipe-sources.json.
- Editorial selections, URLs, IDs, author/section/tag metadata, timestamps and image keys are in content/landing-shortlist.json.
- Snapshot counts are request sample sizes, not complete archive inventories. PV collection totals reported 1369 food entries and 779 recipe entries; these include irrelevant items and are not usable-recipe counts.

### Initial DH placement
Lead: Kadhi chronicles.
Supporting: A taste of winter; Bengaluru darshinis/military hotels/bakeries guide.
Cook: the four-mocktail feature; hirekaayi/upma video stories only after adding them as explicitly marked watch candidates.
Regional: Obbattu history; Odisha culinary heritage; Ramassery idli.
Eating out: Bengaluru vegetarian dining; floral cocktails.
Food stories: Partition and food memory; Georgia bread; food history/science.
Do not feature old festival stories as current news merely because they suit the design.

### Initial PV placement
Lead options: ಸಬ್ಬಸಿಗೆ ಸವಿರುಚಿ (dill recipe collection), or the cloud-kitchen couple feature after full-body editorial review.
Cook: seven-cup barfi, sabudana vada, payasa, badusha, halwa.
Watch: ridge-gourd snacks, brinjal gravy, Malnad chicken (confirm body format before publishing card labels).
Collection: holige varieties and festival sweets, framed as evergreen archive selections.
PV shortlist is recipe-heavy. We have not yet verified enough current eating-out features or kitchen advice to fill every proposed module. Omit those modules until suitable stories are selected; do not pad them with generic health stories.

## API and content selection
Reference: C:/Users/suhas.bhandari/Downloads/Claude/api docs/quintype-qt-website-api.md.
Deepawali implementation reference: ../Deepawali/site/main.js, around loadTaggedStories.
Validated via same-origin fetch from actual DH/PV browser pages:
- DH /api/v1/config: Food & Drink section 56901; Cuisines of Karnataka 97612.
- DH /api/v1/collections/food-and-drink-lifestyle?limit=40 returned 200 and 40 items.
- DH /api/v1/stories/{id} returned 200 for the mocktail, hirekaayi and upma stories.
- PV /api/v1/config: food 51544; recipe 51545; other-food 51546.
- PV /api/v1/collections/food?limit=30 and /api/v1/collections/recipe-food?limit=30 returned 200.
- Three selected PV /api/v1/stories/{id} requests returned 200.

Important findings:
- Broad q=recipe search also returned politics/cricket stories. Do not use it as an unfiltered landing feed.
- PV food and recipe collections include unrelated banking, conflict, reservoir, eye-care and other stories. Membership alone is insufficient.
- PV config marks food and other-food with data.isDisabled=true; food collection still returns content. Recipe routes now point into /health/recipe. Confirm desired navigation and canonical destinations with the publisher; do not rename existing URLs.
- Deepawali uses same-origin /api/v1 requests and documents cross-origin limitations. Local snapshots are appropriate for an independent preview. Cross-origin behavior was not re-tested here.
- Production should use an editor-owned food collection/allowlist, then deduplicate by story ID. Preserve canonical publisher links and story access restrictions.
- A shell curl request failed in this environment; successful validation used same-origin browser fetch instead.

## Recipe conversion
content/tabular-recipe-drafts.json contains three ingredient/operation graphs with original quantities, explicit inputs, joined outputs and editorial questions.
TABULAR_RECIPES.md gives human-readable flow drafts.
1. DH Jamun, Rosemary and Lime Blast: complete written recipe; serves four; five-minute infusion.
2. PV seven-cup barfi: complete core method; qualitative doneness; missing yield/time and nut quantity.
3. PV sabudana vada: clear parallel preparation branches; four-to-five-hour soaking; missing yield/frying time and some quantities.
Do not transcribe video recipes from a summary. Hirekaayi and upma bodies have embedded video plus brief prose, without ingredient quantities or a written method. They require viewing/transcription and editorial checking first.
English working explanations of PV recipes are research aids, not approved translated publication copy. Preserve Kannada source text in published PV treatment.

## Later implementation boundaries
The existing campaign shell can deliver the landing page. New recipe presentation on existing canonical article URLs requires CMS/story-template integration; a landing page alone cannot change those pages.
Once implementation is requested, start with index.html, index.pv.cms.html as required by hosting, site/style.css, site/main.js and content JSON following the sibling conventions. Split story rendering and recipe rendering into focused modules when both are implemented; avoid a framework or general-purpose renderer.
Keep source snapshots, editorial shortlist and normalized recipe drafts separate. Avoid appending repeated CSS overrides; edit the owning component/rule.

## Acceptance checks for the eventual build
- Both publisher identities, native Kannada shaping, visible focus, touch-sized controls and proper heading order.
- 390px mobile, tablet and desktop layouts with no unintended horizontal overflow.
- Current content wins over stale seasonal framing; no irrelevant feed entries or duplicate stories.
- Every rendered recipe ingredient accounted for in a step, with discarded/process ingredients identified.
- No guessed yields, cooking durations, teaspoon conversions, ratings or nutrition.
- Linear accessible method and print layout remain available alongside tabular view.
- Image crops/rights, actual ad slots, CMS canonical URLs and source access rules checked before publication.

## Next decisions
Choose the lead/visual direction and let editorial approve the shortlist; resolve PV module gaps and recipe questions. Then prototype both landing editions and one tabular-recipe article, followed by mobile cooking-use checks.
No application files, dependencies, deployment configuration or external content were changed.

