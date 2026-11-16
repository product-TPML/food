/* Food section · story pages (story.html?id=…&b=dh|pv) and "See all" section pages (section.html?m=…&t=…&b=…).
   Same placeholder content as the landing (content/placeholder-landing.json). The brand comes from the &b= parameter. */
(function () {
  const { el, imageUrl, loadJson, formatDate, loadRecipes, localise } = window.Food;
  const root = document.querySelector('[data-page-root]');
  const page = root.dataset.page;
  const params = new URLSearchParams(location.search);
  const brand = params.get('b') === 'pv' ? 'pv' : 'dh';
  const BRANDS = {
    dh: { name: 'Deccan Herald', logo: 'site/assets/dh-blue-logo-high.png', site: 'https://www.deccanherald.com/' },
    pv: { name: 'Prajavani', logo: 'site/assets/pv-logo.svg', site: 'https://www.prajavani.net/' }
  };
  let data, C;

  // The brand decides language, colours and logo, so set it before any card is built.
  document.documentElement.lang = brand === 'pv' ? 'kn' : 'en';
  document.body.classList.remove('brand-dh', 'brand-pv');
  document.body.classList.add(`brand-${brand}`);
  const logo = document.querySelector('[data-brand-logo]');
  logo.src = BRANDS[brand].logo; logo.alt = BRANDS[brand].name;
  const site = document.querySelector('[data-brand-site]');
  site.href = BRANDS[brand].site; site.setAttribute('aria-label', BRANDS[brand].name);

  function chrome() {
    const home = document.querySelector('[data-food-home]');
    home.href = C.homeUrl; home.textContent = C.T.title;
    const nav = document.querySelector('[data-food-nav]');
    nav.setAttribute('aria-label', C.T.navLabel);
    nav.replaceChildren(...data.modules.filter(m => m.nav).map(m => el('a', { href: `${C.homeUrl}#${m.id}`, text: C.L(m.nav) })));
  }

  // ---- story page ---------------------------------------------------------
  function related(currentId) {
    const ids = Object.keys(data.stories);
    const after = ids.slice(ids.indexOf(currentId) + 1).concat(ids.slice(0, ids.indexOf(currentId)));
    return after.filter(id => data.stories[id].img).slice(0, 5);
  }

  async function renderStory() {
    const id = params.get('id');
    if (!data.stories[id]) throw new Error(`No story "${id}"`);
    const s = C.story(id), A = data.article[C.lang];
    document.title = `${s.title} | ${BRANDS[brand].name}`;
    const more = related(id);
    const breakStory = more.length ? C.story(more[0]) : s;

    const byline = el('p', { class: 'byline' },
      el('span', { text: `${C.T.by} ${s.author}` }),
      el('time', { datetime: s.date, text: formatDate(Date.parse(s.date), C.locale) }),
      el('span', { text: A.minutes }));
    const heroText = el('div', { class: 'story-hero-text' });
    C.put(heroText, el('a', { class: 'back-link', href: C.homeUrl, text: C.T.back }), C.tags(s), el('h1', { class: 'story-title', text: s.title }), s.dek ? el('p', { class: 'story-dek', text: s.dek }) : null, byline);
    // Curtain: the photo stays fixed in place (a layer behind everything); the headline scrolls up with the page and the article
    // (.story-after, opaque) slides over the photo, covering it. The photo dims a little as it is covered.
    // The photo is shown whole (never cropped): it is fitted inside the hero area, and a blurred copy of it fills any space around it.
    const media = el('div', { class: 'story-hero-media', 'data-static': '' });
    const [tone1, tone2] = data.tones[s.tone % data.tones.length];
    media.style.setProperty('--t1', tone1); media.style.setProperty('--t2', tone2);
    if (s.img) {
      media.style.setProperty('--blur-img', `url("${imageUrl(s.img, 400)}")`);
      media.append(el('div', { class: 'story-hero-blur' }), el('img', { class: 'story-hero-img', alt: '', decoding: 'async', fetchpriority: 'high',
        src: imageUrl(s.img, 1600), srcset: [800, 1200, 1600, 2000].map(w => `${imageUrl(s.img, w)} ${w}w`).join(', '), sizes: '100vw' }));
    }
    media.append(el('div', { class: 'story-hero-dim' }));
    const hero = el('header', { class: 'story-hero' }, media, el('div', { class: 'wrap story-hero-wrap' }, heroText));

    // A story can name a different recipe per brand, so each brand shows a recipe in its own language.
    const recipeId = s.recipe && typeof s.recipe === 'object' ? s.recipe[brand] : s.recipe;
    let recipeCard = null;
    if (recipeId) {
      const base = (await loadRecipes()).find(r => r.id === recipeId);
      if (base) {
        const recipe = localise(base, C.lang) || base;
        recipeCard = window.RecipeView.card(recipe, window.RecipeView.STRINGS[recipe.language], { href: C.recipeUrl(recipeId), kicker: s.cat || C.T.cookTitle });
      }
    }

    // Top of the article: a button that jumps straight to the recipe card further down.
    if (recipeCard) {
      heroText.append(el('a', { class: 'jump-recipe', href: '#recipe' }, el('span', { text: C.T.jumpRecipe }), el('span', { class: 'jump-arrow', 'aria-hidden': 'true', text: '↓' })));
    }

    const first = el('article', { class: 'story-col' });
    const col = el('div', { class: 'story-col' });
    const p = (text, cls) => el('p', { class: cls || null, text });
    first.append(p(A.paras[0], 'lede'), p(A.paras[1]), el('blockquote', { class: 'pullquote' }, el('p', { text: A.quote })), p(A.paras[2]));
    const photoBreak = el('figure', { class: 'story-break' }, C.art(breakStory, { shape: 'wide2', link: false, widths: [800, 1200, 1600, 2000], sizes: '100vw' }),
      el('figcaption', { class: 'wrap', text: A.caption }));
    col.append(el('h2', { class: 'story-sub', text: A.sub }), p(A.paras[3]));
    const tail = el('div', { class: 'story-col' }, p(A.paras[4]));

    const copy = el('button', { type: 'button', class: 'share-btn', text: C.T.copyLink });
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); copy.textContent = C.T.copied; } catch { copy.textContent = location.href; }
      setTimeout(() => { copy.textContent = C.T.copyLink; }, 2200);
    });
    const whatsapp = el('a', { class: 'share-btn', href: `https://wa.me/?text=${encodeURIComponent(`${s.title} ${location.href}`)}`, target: '_blank', rel: 'noopener noreferrer', text: C.T.whatsapp });
    tail.append(el('div', { class: 'share' }, el('span', { text: C.T.share }), copy, whatsapp));

    const moreSection = el('section', { class: 'module story-more', 'aria-labelledby': 'more-title' },
      el('div', { class: 'wrap' },
        el('div', { class: 'module-head' }, el('h2', { id: 'more-title', text: C.T.moreFrom })),
        C.rail('pcards cols-5', C.T.moreFrom, more.map(C.story).map(x => C.portraitCard(x)))));

    root.replaceChildren(hero, el('div', { class: 'story-after' }, el('div', { class: 'wrap story-body' }, first), photoBreak, el('div', { class: 'wrap story-body' }, col),
      recipeCard ? el('div', { class: 'wrap story-recipe' }, recipeCard) : null, el('div', { class: 'wrap story-body' }, tail), moreSection));

    const bar = el('div', { class: 'progress', 'aria-hidden': 'true' });
    document.body.prepend(bar);
    const tick = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; };
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();

    // The fixed photo sits just below the sticky header; measure the header so the two line up at every width.
    const header = document.querySelector('.top');
    const place = () => {
      document.documentElement.style.setProperty('--hh', `${header.offsetHeight}px`);
      const covered = Math.max(0, Math.min(1, scrollY / Math.max(1, hero.offsetHeight)));
      media.style.setProperty('--dim', (covered * 0.78).toFixed(3));
    };
    addEventListener('scroll', place, { passive: true }); addEventListener('resize', place); place();
  }

  // ---- "See all" section page --------------------------------------------
  function renderSection() {
    const module = data.modules.find(m => m.id === params.get('m'));
    if (!module) throw new Error('No such section');
    const tab = (module.tabs || []).find(t => t.id === params.get('t'));
    const ids = tab ? tab.stories : (module.stories || []);
    const title = tab ? C.L(tab.label) : C.L(module.title);
    document.title = `${title} | ${BRANDS[brand].name}`;
    document.querySelector('[data-page-title]').textContent = title;
    document.querySelector('[data-page-descriptor]').textContent = C.T.sectionIntro;
    if (data.mastheadImage) document.querySelector('.masthead').style.setProperty('--masthead-image', `url("${imageUrl(data.mastheadImage, 1600, '16:5')}")`);
    root.replaceChildren(
      el('div', { class: 'section-back' }, el('a', { class: 'text-link', href: `${C.homeUrl}#${module.id}`, text: C.T.back })),
      C.rail(`cols-${Math.min(ids.length, 4)}`, title, ids.map(C.story).map(s => C.card(s, { shape: 'portrait' }))));
  }

  async function init() {
    try {
      data = await loadJson('content/placeholder-landing.json');
      C = window.Cards.create(data);
      chrome();
      if (page === 'story') await renderStory(); else renderSection();
      window.Parallax.init();
    } catch (error) {
      console.error(error);
      root.replaceChildren(el('p', { class: 'load-error', role: 'alert', text: (C && C.T.notFound) || 'This page could not be found.' }),
        el('p', {}, el('a', { class: 'text-link', href: 'index.html', text: '← Food' })));
    }
  }
  init();
})();
