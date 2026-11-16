# Tabular recipe drafts
Planning artifact only. These are content flows for a later grid renderer, not implemented article pages. Source quantities and missing details are preserved in content/tabular-recipe-drafts.json; original API bodies are saved alongside it.

Read left to right. Separate ingredient/preparation rows converge into a shared operation, which becomes one spanning cell in the eventual grid. The diagrams below express those joins without pretending Markdown tables can merge cells.

## DH: Jamun, Rosemary and Lime Blast
Source: https://www.deccanherald.com/lifestyle/food-and-drink/let-the-good-times-fizz-4211004
Story ID: 05caadb6-97c2-44b9-afbd-5312ea7d6962. Serves 4.

```text
2 cups ripe jamun, deseeded/pureed OR 1 cup canned juice ─┐
60 ml fresh lime juice ──────────────────────────────────┼─ BLEND ─────┐
60 ml sugar syrup, or to taste ──────────────────────────┘             │
4 small rosemary sprigs ── BRUISE ────────────────────────────────────┴─ INFUSE 5 MIN
                                                                         │ remove sprigs
1 cup ice, divided into 4 glasses ────────────────────────────────────────┴─ DIVIDE BASE
600 ml chilled soda ───────────────────────────────────────────────────────┴─ TOP + STIR
                                                                            ~150 ml/glass
Thin lime wheels + 4 NEW rosemary sprigs ────────────────────────────────────┴─ GARNISH
```

The first four sprigs leave the drink; garnish uses four different sprigs. Do not turn the canned-juice alternative into an additional ingredient. Confirm whether the two-cup jamun measure is before or after pureeing. No total preparation time provided.

## PV: ಸೆವೆನ್ ಕಪ್ ಬರ್ಫಿ / Seven-cup barfi
Source: https://www.prajavani.net/health/recipe/diwali-special-seven-cup-barfi-recipe-kannada-4371802
Story ID: 872ecd31-ff0d-420c-932d-cd917b6b8587. Author: ವೀಣಾಶ್ರೀ.
English action labels below are a working explanation; Kannada actions are in the draft JSON.

```text
Besan / ಕಡಲೆ ಹಿಟ್ಟು, 1 cup ── ROAST ON LOW UNTIL AROMATIC ─┐
Grated coconut, 1 cup ────────────────────────────────────┤
Sugar, 3 cups ────────────────────────────────────────────┼─ MIX WITHOUT LUMPS ──┐
Milk, 1 cup ──────────────────────────────────────────────┤                     │
Ghee, 1 cup ──────────────────────────────────────────────┘                     │
Cashew + almond, as needed ── COARSELY GRIND ───────────────────────────────────┴─ ADD
                                                                                 │
                                             STIR ON MEDIUM UNTIL THICK / LEAVES PAN
                                                                                 │
Tray-greasing ghee, amount unspecified ── GREASE TRAY ─────────────────────────────┴─ POUR
                                                                                     │
                                                                   COOL SLIGHTLY → CUT
                                                                                     │
                                                                  COOL FULLY → SEPARATE
```

The five main quantities total seven cups. Nut quantity, finished yield, cooking duration and cooling duration are absent. Tray grease is mentioned in the method; it is unclear whether it comes from the listed cup of ghee. Do not infer these values.

## PV: ಸಾಬುದಾನ ವಡೆ / Sabudana vada
Source: https://www.prajavani.net/health/recipe/sabudana-vada-recipe-evening-snacks-kannada-4329492
Story ID: ccd56f47-8323-408e-bcd0-76f8a8adc688. Author: ವೀಣಾಶ್ರೀ.

```text
Sabudana, 1 cup + soaking water ── SOAK 4–5 HOURS → DRAIN COMPLETELY ─┐
Potatoes, 2 ── BOIL → MASH ──────────────────────────────────────────┤
Peanuts, ½ cup ── ROAST → GRIND ─────────────────────────────────────┤
Green chillies, 2 ──────────────────────────────────────────────────┤
Cumin, 1 ಚಮಚ ────────────────────────────────────────────────────────┼─ MIX → SHAPE FLAT VADAS ─┐
Coriander, amount unspecified ──────────────────────────────────────┤                         │
Lemon juice, 1 ಚಮಚ ─────────────────────────────────────────────────┤                         │
Salt to taste ─────────────────────────────────────────────────────┘                         │
Oil, amount unspecified ── HEAT ─────────────────────────────────────────────────────────────┴─ FRY
                                                          medium heat; both sides golden + crisp
                                                                                              │
                                                                  SERVE WITH CHUTNEY OR CURD
```

Soaking water is drained, not incorporated. Boiling/mashing potatoes and roasting/grinding peanuts are source-supported preparations embedded in the original method. Their durations are not supplied.
Keep ಚಮಚ as written: the source does not specify teaspoon or tablespoon. No soaking-water ratio, frying duration or yield provided. Green-chilli preparation is unspecified; do not silently add chopping instructions.

## Review status
An independent source-fidelity review confirmed these three as suitable drafts and flagged the questions above. None has been cooking-tested. Before publication, a Kannada editor should review PV copy and a recipe editor should resolve omissions.
The renderer should provide joined grid cells on wide screens and a complete accessible linear method on small screens. Evaluate an optional grid view on mobile; do not require pinch-zoom or horizontal scrolling to cook.

