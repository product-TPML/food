/* Food section · recipe rendering shared by recipe.html and the story pages. RecipeView.method(recipe, t) builds the ingredient grid
   (desktop table / phone nested boxes) with a list view and print button; RecipeView.card(...) wraps it as an inline recipe card.
   Nothing is invented: absent yield/time are omitted. A recipe is a tree of ingredients and operations (see architechture.md). */
(function () {
  const { el } = window.Food;

  const STRINGS = {
    en: {
      back: '← Back to Food', draft: 'Draft recipe notation. Not cooking-tested and not approved for publication.',
      ingredients: 'Ingredients', method: 'Method', grid: 'Grid view', list: 'List view', print: 'Print',
      source: 'Read the original story', serves: 'Yield', time: 'Total time',
      resultOf: n => `Result of step ${n}`, discard: 'Remove and discard', using: 'Using', notes: 'Editorial notes (preview only)',
      viewLabel: 'Recipe layout', notFound: 'This recipe could not be found.', chooser: 'Step-by-step recipes', allRecipes: 'All recipes',
      gridCaption: 'Recipe grid: each operation spans the ingredients it combines, left to right in order. Use List view for a linear method.',
      scrollHint: 'This recipe is wide: scroll sideways to follow every step, or switch to List view.',
      translated: from => `Translated working copy of the ${from} original; the translation is not approved.`, langLabel: 'Language',
      langNames: { en: 'English', kn: 'Kannada' }, fullPage: 'Open the full recipe page'
    },
    kn: {
      back: '← ಆಹಾರ ಪುಟಕ್ಕೆ', draft: 'ರೆಸಿಪಿ ಸಂಕೇತ ಕರಡು. ಅಡುಗೆ ಪರೀಕ್ಷೆ ಮತ್ತು ಪ್ರಕಟಣೆಗೆ ಅನುಮೋದನೆ ಆಗಿಲ್ಲ.',
      ingredients: 'ಪದಾರ್ಥಗಳು', method: 'ವಿಧಾನ', grid: 'ಕೋಷ್ಟಕ ನೋಟ', list: 'ಪಟ್ಟಿ ನೋಟ', print: 'ಮುದ್ರಿಸಿ',
      source: 'ಮೂಲ ಬರಹ ಓದಿ', serves: 'ಪ್ರಮಾಣ', time: 'ಒಟ್ಟು ಸಮಯ',
      resultOf: n => `ಹಂತ ${n}ರ ಫಲಿತಾಂಶ`, discard: 'ತೆಗೆದು ಬಿಡಿ', using: 'ಬಳಕೆ', notes: 'ಸಂಪಾದಕೀಯ ಟಿಪ್ಪಣಿಗಳು (ಪೂರ್ವನೋಟ ಮಾತ್ರ)',
      viewLabel: 'ರೆಸಿಪಿ ವಿನ್ಯಾಸ', notFound: 'ಈ ರೆಸಿಪಿ ಸಿಗಲಿಲ್ಲ.', chooser: 'ಹಂತ ಹಂತದ ರೆಸಿಪಿಗಳು', allRecipes: 'ಎಲ್ಲ ರೆಸಿಪಿಗಳು',
      gridCaption: 'ರೆಸಿಪಿ ಕೋಷ್ಟಕ: ಪ್ರತಿ ಕ್ರಿಯೆ ತಾನು ಸೇರಿಸುವ ಪದಾರ್ಥಗಳನ್ನು ಒಳಗೊಂಡಿದೆ, ಎಡದಿಂದ ಬಲಕ್ಕೆ ಕ್ರಮವಾಗಿ. ಸಾಲಾಗಿ ವಿಧಾನಕ್ಕೆ ಪಟ್ಟಿ ನೋಟ ಬಳಸಿ.',
      scrollHint: 'ಈ ಕೋಷ್ಟಕ ಅಗಲವಾಗಿದೆ: ಎಲ್ಲ ಹಂತಗಳಿಗೆ ಅಡ್ಡಲಾಗಿ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ, ಅಥವಾ ಪಟ್ಟಿ ನೋಟಕ್ಕೆ ಬದಲಿಸಿ.',
      translated: from => `${from} ಮೂಲದ ಅನುವಾದಿತ ಕರಡು; ಈ ಅನುವಾದಕ್ಕೆ ಅನುಮೋದನೆ ಆಗಿಲ್ಲ.`, langLabel: 'ಭಾಷೆ',
      langNames: { en: 'ಇಂಗ್ಲಿಷ್', kn: 'ಕನ್ನಡ' }, fullPage: 'ಪೂರ್ಣ ರೆಸಿಪಿ ಪುಟ ತೆರೆಯಿರಿ'
    }
  };

  const ingredientText = (recipe, key) => new Map(recipe.ingredients).get(key) || key;

  // Lay the operation tree out on a grid. Rows are ingredients in depth-first order; each operation covers the
  // contiguous rows of its leaves and sits in the column equal to its height (1 + the tallest operation it consumes).
  // Returns null when the recipe is not a tree (an input used twice), so the caller can fall back to the list.
  function layoutGrid(recipe) {
    const ops = new Map(recipe.operations.map(op => [op.id, op]));
    const ingredientKeys = new Set(recipe.ingredients.map(([key]) => key));
    const consumed = new Set(recipe.operations.flatMap(op => op.inputs));
    const uses = new Map();
    for (const op of recipe.operations) for (const key of op.inputs) uses.set(key, (uses.get(key) || 0) + 1);
    if ([...uses.values()].some(count => count > 1)) return null;

    const order = [];
    const leaves = new Map();
    const height = new Map();
    function visit(id) {
      if (ingredientKeys.has(id)) { order.push(id); return { rows: [id], height: 0 }; }
      const op = ops.get(id);
      if (!op) return { rows: [], height: 0 };
      const rows = []; let tallest = 0;
      for (const input of op.inputs) { const child = visit(input); rows.push(...child.rows); tallest = Math.max(tallest, child.height); }
      leaves.set(id, rows); height.set(id, tallest + 1);
      return { rows, height: tallest + 1 };
    }
    const roots = recipe.operations.filter(op => !consumed.has(op.id));
    for (const root of roots) visit(root.id);
    for (const [key] of recipe.ingredients) if (!order.includes(key)) { console.warn(`Recipe ${recipe.id}: ingredient "${key}" is not used by any step`); order.push(key); }

    const rowOf = new Map(order.map((key, index) => [key, index]));
    const cells = [];
    for (const op of recipe.operations) {
      const rows = (leaves.get(op.id) || []).map(key => rowOf.get(key));
      if (!rows.length) continue;
      const start = Math.min(...rows), end = Math.max(...rows);
      if (end - start + 1 !== rows.length) { console.warn(`Recipe ${recipe.id}: step "${op.id}" is not contiguous`); return null; }
      cells.push({ op, row: start, span: rows.length, column: height.get(op.id) });
    }
    return { order, cells, columns: Math.max(...cells.map(cell => cell.column)) };
  }

  function tableGrid(recipe, t, layout) {
    const taken = new Set(); // "row:column" slots covered by a spanning cell
    const starts = new Map(layout.cells.map(cell => [`${cell.row}:${cell.column}`, cell]));
    for (const cell of layout.cells) for (let r = cell.row; r < cell.row + cell.span; r++) taken.add(`${r}:${cell.column}`);

    const rows = layout.order.map((key, row) => {
      const tr = el('tr', {}, el('th', { scope: 'row', class: 'g-ingredient', text: ingredientText(recipe, key) }));
      for (let column = 1; column <= layout.columns; column++) {
        const cell = starts.get(`${row}:${column}`);
        if (cell) {
          const discarded = (cell.op.discarded || []).map(k => ingredientText(recipe, k));
          tr.append(el('td', { class: 'g-op', rowspan: cell.span },
            el('span', { text: cell.op.action }),
            discarded.length ? el('span', { class: 'discard', text: `${t.discard}: ${discarded.join('; ')}` }) : null));
        } else if (!taken.has(`${row}:${column}`)) {
          tr.append(el('td', { class: 'g-empty' }));
        }
      }
      return tr;
    });
    return el('div', { class: 'table-wrap' },
      el('table', { class: 'recipe-grid' }, el('caption', { class: 'visually-hidden', text: t.gridCaption }), el('tbody', {}, ...rows)));
  }

  // The same grid for phones: each operation becomes a box that wraps the ingredients and earlier results it
  // combines, with its action underneath. The grouping reads like the grid's spanning cells, in one column.
  function nestedView(recipe, t) {
    const ops = new Map(recipe.operations.map(op => [op.id, op]));
    const consumed = new Set(recipe.operations.flatMap(op => op.inputs));
    function group(op) {
      const discarded = (op.discarded || []).map(key => ingredientText(recipe, key));
      return el('div', { class: 'g-group' },
        ...op.inputs.map(key => ops.has(key) ? group(ops.get(key)) : el('p', { class: 'g-leaf', text: ingredientText(recipe, key) })),
        el('p', { class: 'g-action' }, el('span', { text: op.action }),
          discarded.length ? el('span', { class: 'discard', text: `${t.discard}: ${discarded.join('; ')}` }) : null));
    }
    return el('div', { class: 'g-nested' }, ...recipe.operations.filter(op => !consumed.has(op.id)).map(group));
  }

  function gridView(recipe, t, layout) {
    const table = tableGrid(recipe, t, layout);
    // Long chains of steps make a wide grid. Say so, but only while the table is shown and actually overflows.
    const hint = el('p', { class: 'scroll-hint', text: t.scrollHint, hidden: true });
    new ResizeObserver(() => { hint.hidden = !(table.clientWidth > 0 && table.scrollWidth > table.clientWidth + 1); }).observe(table);
    return el('div', { class: 'grid-view' }, table, hint, nestedView(recipe, t));
  }

  function listView(recipe, t) {
    const stepNumbers = new Map(recipe.operations.map((op, index) => [op.id, index + 1]));
    const describe = op => op.inputs.map(key => stepNumbers.has(key) ? t.resultOf(stepNumbers.get(key)) : ingredientText(recipe, key));
    const steps = recipe.operations.map(op => {
      const discarded = (op.discarded || []).map(key => ingredientText(recipe, key));
      return el('li', {},
        el('span', { class: 'method-action', text: op.action }),
        el('span', { class: 'method-using', text: `${t.using}: ${describe(op).join('; ')}` }),
        discarded.length ? el('span', { class: 'discard', text: `${t.discard}: ${discarded.join('; ')}` }) : null);
    });
    return el('div', { class: 'list-view' },
      el('h3', { text: t.ingredients }),
      el('ul', { class: 'ingredient-list' }, ...recipe.ingredients.map(([, text]) => el('li', { text }))),
      el('h3', { text: t.method }),
      el('ol', { class: 'method-list' }, ...steps));
  }

  // The "Ingredients · Method" section: grid view (default) and list view with a toggle and a print button.
  function method(recipe, t, idPrefix = 'method') {
    const layout = layoutGrid(recipe);
    const views = { list: listView(recipe, t) };
    if (layout) views.grid = gridView(recipe, t, layout);

    const toggle = el('div', { class: 'toggle no-print', role: 'group', 'aria-label': t.viewLabel });
    const buttons = {};
    const labels = { grid: t.grid, list: t.list };
    function show(which) {
      for (const [name, view] of Object.entries(views)) { view.hidden = name !== which; buttons[name].setAttribute('aria-pressed', String(name === which)); }
    }
    for (const name of Object.keys(views).sort()) { // alphabetical puts grid before list
      buttons[name] = el('button', { type: 'button', 'aria-pressed': 'false', text: labels[name] });
      buttons[name].addEventListener('click', () => show(name));
      toggle.append(buttons[name]);
    }
    const printBtn = el('button', { type: 'button', class: 'print-btn', text: t.print });
    printBtn.addEventListener('click', () => { show('list'); window.print(); });
    toggle.append(printBtn);

    const section = el('section', { class: 'method', 'aria-labelledby': `${idPrefix}-title` },
      el('div', { class: 'method-head' }, el('h2', { id: `${idPrefix}-title`, text: `${t.ingredients} · ${t.method}` }), toggle),
      ...Object.values(views));
    // Grid view adapts by width (table on larger screens, nested boxes on phones), so it is the default everywhere.
    show(views.grid ? 'grid' : 'list');
    return section;
  }

  // An inline recipe card for story pages: kicker, title, facts, draft note, the method, and a link to the full recipe page.
  function card(recipe, t, { href, kicker, idPrefix = 'story-method' } = {}) {
    const facts = [recipe.yield && [t.serves, recipe.yield], recipe.totalTime && [t.time, recipe.totalTime]].filter(Boolean);
    const note = recipe.translated ? `${t.draft} ${t.translated(t.langNames[recipe.originalLanguage])}` : t.draft;
    return el('section', { class: 'recipe-card', id: 'recipe', lang: recipe.language, 'aria-labelledby': `${idPrefix}-recipe-title` },
      kicker ? el('p', { class: 'tags' }, el('span', { class: 'tag tag-recipe', text: kicker })) : null,
      el('h2', { id: `${idPrefix}-recipe-title`, class: 'recipe-card-title', text: recipe.title }),
      facts.length ? el('dl', { class: 'facts' }, ...facts.flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: v })])) : null,
      el('p', { class: 'draft-note', text: note }),
      method(recipe, t, idPrefix),
      href ? el('p', { class: 'recipe-card-link no-print' }, el('a', { class: 'text-link', href, text: `${t.fullPage} →` })) : null);
  }

  window.RecipeView = { STRINGS, method, card };
})();
