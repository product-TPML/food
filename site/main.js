/* Food section · landing page. Renders content/placeholder-landing.json, the same placeholder stories for DH and PV.
   Text language follows <html lang> ("kn" on PV). Links are inert placeholders until real content is wired in. */
(function () {
  const { el, imageUrl, formatDate, loadJson } = window.Food;
  const root = document.querySelector('[data-food-root]');
  const lang = document.documentElement.lang === 'kn' ? 'kn' : 'en';
  const locale = lang === 'kn' ? 'kn-IN' : 'en-IN';
  let data, T;

  const L = value => (value && typeof value === 'object' ? (value[lang] || value.en) : value);
  const put = (parent, ...nodes) => parent.append(...nodes.filter(Boolean)); // native append(null) would print "null"
  const story = id => ({ id, ...data.stories[id], ...data.stories[id][lang] });

  // ---- pieces -------------------------------------------------------------
  const RATIO = { wide: '3:2', wide2: '16:9', '43': '4:3', square: '1:1', portrait: '4:5', tall: '2:3' };

  function art(s, { shape, link = true, eager = false } = {}) {
    const frame = el(link ? 'a' : 'div', { class: `art ar-${shape || s.shape}`, href: link ? '#' : null, 'data-placeholder': link ? '' : null, tabindex: link ? '-1' : null, 'aria-hidden': 'true' });
    const [from, to] = data.tones[s.tone % data.tones.length];
    frame.style.setProperty('--t1', from);
    frame.style.setProperty('--t2', to);
    if (s.img) {
      // The CDN crops to the card's ratio; the tone gradient underneath shows if the photo fails.
      const ratio = RATIO[shape || s.shape];
      const url = width => imageUrl(s.img, width, ratio);
      const img = el('img', { alt: '', width: 800, height: Math.round(800 * ratio.split(':')[1] / ratio.split(':')[0]), decoding: 'async', loading: eager ? 'eager' : 'lazy', fetchpriority: eager ? 'high' : null,
        src: url(800), srcset: `${url(400)} 400w, ${url(800)} 800w, ${url(1200)} 1200w`, sizes: '(max-width: 1023px) 72vw, 40vw' });
      img.addEventListener('error', () => { img.remove(); frame.classList.remove('has-img'); });
      frame.classList.add('has-img');
      frame.append(img);
    }
    return frame;
  }

  function tags(s) {
    const label = s.kind ? T.kinds[s.kind] : s.cat;
    return label ? el('p', { class: 'tags' }, el('span', { class: `tag tag-${s.kind || 'story'}`, text: label })) : null;
  }

  function meta(s) {
    // Cities show the area; everything else shows author at the left and the date at the right edge.
    if (s.area) return el('p', { class: 'meta' }, el('span', { class: 'author', text: L(s.area) }));
    return el('p', { class: 'meta' },
      el('span', { class: 'author', text: `${T.by} ${s.author}` }),
      el('time', { class: 'date', datetime: s.date, text: formatDate(Date.parse(s.date), locale) }));
  }

  const headline = (s, level) => el(`h${level}`, { class: 'headline' }, el('a', { href: '#', 'data-placeholder': '', text: s.title }));
  const dek = s => (s.dek ? el('p', { class: 'dek', text: s.dek }) : null);

  function card(s, { shape, level = 3 } = {}) {
    const body = el('div', { class: 'card-body' });
    put(body, tags(s), headline(s, level), dek(s), meta(s));
    return el('article', { class: 'card' }, art(s, { shape }), body);
  }

  // Full-bleed portrait card, text on a dark gradient at the bottom (The Hindu style).
  // glass: a 4:5 card whose text sits in a frosted, translucent panel over the photo instead of a dark gradient.
  function portraitCard(s, { level = 3, glass = false } = {}) {
    const link = el('a', { class: 'pcard-link', href: '#', 'data-placeholder': '' });
    const text = el('div', { class: 'pcard-text' });
    put(text, tags(s), el(`h${level}`, { class: 'headline', text: s.title }), meta(s));
    link.append(art(s, { shape: glass ? 'portrait' : 'tall', link: false }), text);
    return el('article', { class: glass ? 'pcard pcard--glass' : 'pcard' }, link);
  }

  // A row of cards: a grid on desktop, a swipeable scroll-snap carousel below 1024px.
  const rail = (className, label, nodes) => el('div', { class: `rail ${className}`, role: 'group', 'aria-label': label, tabindex: '0' }, ...nodes);

  function lead(ids, level, variant) {
    const [main, ...support] = ids.map(story);
    const hero = el('article', { class: 'lead-main' });
    const body = el('div', { class: 'lead-body' });
    put(body, tags(main), headline(main, level), dek(main), meta(main));
    hero.append(art(main, { shape: variant === 'hero' ? 'wide' : '43', eager: variant === 'hero' }), body);
    const side = el('div', { class: 'lead-side' });
    for (const s of support) {
      const text = el('div', { class: 'row-body' });
      put(text, tags(s), headline(s, level + 1), meta(s));
      side.append(el('article', { class: 'row' }, art(s, { shape: 'square' }), text));
    }
    return el('div', { class: `lead lead--${variant}` }, hero, side);
  }

  function list(ids) {
    return el('ul', { class: 'more-list' }, ...ids.map(story).map(s => el('li', {}, headline(s, 3), meta(s))));
  }

  // Sleek pill tabs: one panel per city, arrow keys / Home / End move between tabs.
  function tabs(module, label) {
    const tablist = el('div', { class: 'tabs', role: 'tablist', 'aria-label': label });
    const buttons = [], panels = [];
    function select(index, focus) {
      buttons.forEach((b, i) => {
        b.setAttribute('aria-selected', String(i === index));
        b.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) buttons[index].focus();
    }
    module.tabs.forEach((tab, i) => {
      const name = L(tab.label);
      const button = el('button', { type: 'button', class: 'tab', role: 'tab', id: `${module.id}-tab-${i}`, 'aria-controls': `${module.id}-panel-${i}`, text: name });
      button.addEventListener('click', () => select(i, false));
      button.addEventListener('keydown', event => {
        const last = buttons.length - 1;
        const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[event.key];
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
      const cards = tab.stories.map(story).map(s => card(s, { shape: 'portrait' }));
      const panel = el('div', { class: 'tab-panel', role: 'tabpanel', id: `${module.id}-panel-${i}`, 'aria-labelledby': button.id },
        rail('cols-3', name, cards),
        el('a', { class: 'text-link', href: '#', 'data-placeholder': '', text: `${T.seeAll.replace('{city}', name)} →` }));
      buttons.push(button); panels.push(panel); tablist.append(button);
    });
    const wrap = el('div', { class: 'tabs-wrap' }, tablist, ...panels);
    select(0, false);
    return wrap;
  }

  const adSlot = name => el('div', { class: 'ad-slot', 'data-ad-slot': name, role: 'complementary', 'aria-label': T.adLabel }, el('span', { text: T.adLabel }));

  // ---- modules ------------------------------------------------------------
  function renderModule(module) {
    const title = L(module.title);
    const section = el('section', { class: `module module-${module.type}`, id: module.id, 'aria-labelledby': `${module.id}-title` });
    section.append(el('div', { class: module.hideTitle ? 'visually-hidden' : 'module-head' },
      el('h2', { id: `${module.id}-title`, text: title }),
      module.intro ? el('p', { class: 'intro', text: L(module.intro) }) : null));
    const ids = module.stories || [];
    if (module.type === 'lead') section.append(lead(ids, 3, 'hero'));
    else if (module.type === 'split') section.append(lead(ids, 3, 'split'));
    else if (module.type === 'portrait') section.append(rail('pcards cols-5', title, ids.map(story).map(s => portraitCard(s))));
    else if (module.type === 'glass') section.append(rail('pcards cols-4', title, ids.map(story).map(s => portraitCard(s, { glass: true }))));
    else if (module.type === 'tabs') section.append(tabs(module, title));
    else if (module.type === 'list') section.append(list(ids));
    else section.append(rail(`cols-${Math.min(ids.length, 4)}`, title, ids.map(story).map(s => card(s))));
    return section;
  }

  function renderNav(modules) {
    const nav = document.querySelector('[data-food-nav]');
    if (!nav) return;
    nav.setAttribute('aria-label', T.navLabel);
    nav.replaceChildren(...modules.filter(m => m.nav).map(m => el('a', { href: `#${m.id}`, text: L(m.nav) })));
  }

  async function init() {
    try {
      data = await loadJson(root.dataset.layout);
      T = data.strings[lang];
      document.querySelectorAll('[data-food-title]').forEach(n => { n.textContent = T.title; });
      document.querySelectorAll('[data-food-descriptor]').forEach(n => { n.textContent = T.descriptor; });
      if (data.mastheadImage) {
        document.querySelector('.masthead').style.setProperty('--masthead-image', `url("${imageUrl(data.mastheadImage, 1600, '16:5')}")`);
      }
      const nodes = [];
      for (const module of data.modules) {
        nodes.push(renderModule(module));
        if (module.ad) nodes.push(adSlot(module.ad));
      }
      root.replaceChildren(...nodes);
      root.addEventListener('click', event => { if (event.target.closest('[data-placeholder]')) event.preventDefault(); });
      renderNav(data.modules);
    } catch (error) {
      console.error(error);
      root.replaceChildren(el('p', { class: 'load-error', role: 'alert', text: (T && T.loadError) || 'Stories could not be loaded.' }));
    }
  }

  init();
})();
