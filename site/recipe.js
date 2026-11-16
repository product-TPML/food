/* Food section · tabular recipe view. Renders one draft from content/tabular-recipe-drafts.json as the
   "recipe grid": ingredients run down the left, and each operation is a cell to their right that spans the rows
   of everything it combines (earlier results included). A linear list view sits beside it for phones, screen
   readers and print. Nothing is invented: absent yield/time are omitted, unresolved questions are listed. */
(function () {
  const { el, imageUrl, loadJson, loadRecipes, localise } = window.Food;
  const root = document.querySelector('[data-recipe-root]');

  const BRANDS = {
    DH: { logo: 'site/assets/dh-blue-logo-high.png', name: 'Deccan Herald', home: 'index.html', site: 'https://www.deccanherald.com/', food: 'Food' },
    PV: { logo: 'site/assets/pv-logo.svg', name: 'Prajavani', home: 'index.pv.html', site: 'https://www.prajavani.net/', food: 'ಸವಿರುಚಿ' }
  };
  const { STRINGS } = window.RecipeView;

  // Two-button language switch; names are always written in their own language so people can find theirs.
  function langSwitch(current, label, onChange) {
    const group = el('div', { class: 'lang-switch no-print', role: 'group', 'aria-label': label });
    for (const [code, name] of [['en', 'English'], ['kn', 'ಕನ್ನಡ']]) {
      const button = el('button', { type: 'button', lang: code, 'aria-pressed': String(code === current), text: name });
      button.addEventListener('click', () => { if (code !== current) onChange(code); });
      group.append(button);
    }
    return group;
  }
  function rememberLang(lang) {
    const url = new URL(location.href); url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }

  // Photo masthead with the title, and the black nav strip, to match the landing and story pages.
  let parallaxStarted = false;
  async function setChrome(brand, title, subtitle, allLabel, subLang = 'en') {
    const home = document.querySelector('[data-brand-home]');
    home.href = brand.home; home.textContent = brand.food;
    const site = document.querySelector('[data-brand-site]');
    if (site) { site.href = brand.site; site.setAttribute('aria-label', brand.name); }
    document.querySelector('[data-recipe-nav]').replaceChildren(
      el('a', { href: brand.home, text: brand.food }), el('a', { href: 'recipe.html', text: allLabel }));
    const masthead = document.querySelector('[data-recipe-masthead]');
    document.querySelector('[data-recipe-title]').textContent = title;
    const sub = document.querySelector('[data-recipe-sub]');
    sub.textContent = subtitle || ''; sub.hidden = !subtitle; sub.lang = subLang;
    masthead.hidden = false;
    try {
      const data = await loadJson('content/placeholder-landing.json');
      if (data.mastheadImage) masthead.style.setProperty('--masthead-image', `url("${imageUrl(data.mastheadImage, 1600, '16:5')}")`);
    } catch (error) { console.warn('masthead photo skipped', error); }
    if (!parallaxStarted) { parallaxStarted = true; window.Parallax.init(); }
  }

  function render(base, lang) {
    const recipe = localise(base, lang) || base; // falls back to the original when no complete translation exists
    lang = recipe.language;
    const brand = BRANDS[base.brand] || BRANDS.DH;
    const t = STRINGS[lang] || STRINGS.en;
    document.documentElement.lang = lang;
    document.body.classList.remove('brand-dh', 'brand-pv');
    document.body.classList.add(`brand-${base.brand.toLowerCase()}`);
    document.title = `${recipe.title} | ${brand.name}`;
    const logo = document.querySelector('[data-brand-logo]');
    logo.src = brand.logo; logo.alt = brand.name;

    const facts = [recipe.yield && [t.serves, recipe.yield], recipe.totalTime && [t.time, recipe.totalTime]].filter(Boolean);
    const hasBoth = !!localise(base, lang === 'en' ? 'kn' : 'en');
    const top = el('div', { class: 'recipe-top' }, el('a', { class: 'text-link', href: brand.home, text: t.back }),
      hasBoth ? langSwitch(lang, t.langLabel, code => { rememberLang(code); render(base, code); }) : null);
    const head = el('header', { class: 'recipe-head' },
      top,
      facts.length ? el('dl', { class: 'facts' }, ...facts.flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: v })])) : null,
      el('p', { class: 'draft-note', text: recipe.translated ? `${t.draft} ${t.translated(t.langNames[recipe.originalLanguage])}` : t.draft }),
      el('div', { class: 'actions no-print' },
        el('a', { class: 'text-link', href: recipe.sourceUrl, target: '_blank', rel: 'noopener noreferrer', text: `${t.source} →` })));

    const method = window.RecipeView.method(recipe, t);

    const notes = (recipe.editorialQuestions || []).length
      ? el('details', { class: 'notes no-print' }, el('summary', { text: t.notes }),
          el('ul', {}, ...recipe.editorialQuestions.map(q => el('li', { lang: 'en', text: q }))))
      : null;

    root.replaceChildren(head, method, notes);
    // Subtitle: the title in the other language when we have it, so readers can match it to the story they came from.
    const other = lang === 'en' ? 'kn' : 'en';
    const otherRecipe = localise(base, other);
    const subtitle = otherRecipe ? otherRecipe.title : (lang === base.language ? base.workingEnglishTitle : base.title);
    setChrome(brand, recipe.title, subtitle, t.allRecipes, otherRecipe ? other : (lang === base.language ? 'en' : base.language));
  }

  // A list of recipes to pick from: one story's recipes (?story=) or every draft (no parameters), grouped by brand.
  function renderChooser(recipes, wantLang) {
    const brands = [...new Set(recipes.map(r => r.brand))];
    const first = BRANDS[brands[0]] || BRANDS.DH;
    const lang = wantLang || recipes[0].language;
    const t = STRINGS[lang] || STRINGS.en;
    document.documentElement.lang = lang;
    document.body.classList.remove('brand-dh', 'brand-pv');
    document.body.classList.add(`brand-${brands[0].toLowerCase()}`);
    document.title = `${t.chooser} | ${first.name}`;
    const logo = document.querySelector('[data-brand-logo]');
    logo.src = first.logo; logo.alt = first.name;

    const other = lang === 'en' ? 'kn' : 'en';
    const groups = brands.map(brand => el('section', { class: 'picker-group' },
      brands.length > 1 ? el('h2', { text: BRANDS[brand].name }) : null,
      el('ul', { class: 'recipe-picker' }, ...recipes.filter(r => r.brand === brand).map(r => {
        const shown = localise(r, lang) || r, alt = localise(r, other);
        return el('li', {}, el('a', { href: `recipe.html?id=${encodeURIComponent(r.id)}&lang=${shown.language}` },
          el('span', { class: 'picker-title', lang: shown.language, text: shown.title }),
          alt ? el('span', { class: 'picker-sub', lang: alt.language, text: alt.title }) : null));
      }))));
    const switcher = langSwitch(lang, t.langLabel, code => { rememberLang(code); renderChooser(recipes, code); });
    root.replaceChildren(
      el('header', { class: 'recipe-head' }, el('div', { class: 'recipe-top' }, el('a', { class: 'text-link', href: first.home, text: t.back }), switcher)),
      ...groups);
    setChrome(first, t.chooser, '', t.allRecipes);
  }

  async function init() {
    const params = new URLSearchParams(location.search);
    try {
      const recipes = await loadRecipes();
      const id = params.get('id'), story = params.get('story');
      if (id) {
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) throw new Error(`No recipe "${id}"`);
        render(recipe, ['en', 'kn'].includes(params.get('lang')) ? params.get('lang') : recipe.language);
      } else {
        const list = story ? recipes.filter(r => r.sourceStoryId === story) : recipes;
        if (!list.length) throw new Error('No recipes to list');
        renderChooser(list, ['en', 'kn'].includes(params.get('lang')) ? params.get('lang') : null);
      }
    } catch (error) {
      console.error(error);
      root.replaceChildren(el('p', { class: 'load-error', role: 'alert', text: STRINGS.en.notFound }),
        el('p', {}, el('a', { class: 'text-link', href: 'index.html', text: STRINGS.en.back })));
    }
  }
  init();
})();
