/* Food section · landing page. Renders content/placeholder-landing.json, the same placeholder stories for DH and PV.
   Text language follows <html lang> ("kn" on PV). Every card links to story.html; city "See all" links open section.html. */
(function () {
  const { el, imageUrl, loadJson } = window.Food;
  const root = document.querySelector('[data-food-root]');
  let data, C;

  function lead(ids, level, variant) {
    const [main, ...support] = ids.map(C.story);
    const hero = el('article', { class: 'lead-main' });
    const body = el('div', { class: 'lead-body' });
    C.put(body, C.tags(main), C.headline(main, level), C.dek(main), C.meta(main));
    if (variant === 'split' && main.img) body.style.setProperty('--glass-img', `url("${imageUrl(main.img, 400, window.Cards.RATIO['43'])}")`);
    hero.append(C.art(main, { shape: variant === 'hero' ? 'wide' : '43', eager: variant === 'hero' }), body);
    const side = el('div', { class: 'lead-side' });
    for (const s of support) {
      const text = el('div', { class: 'row-body' });
      C.put(text, C.tags(s), C.headline(s, level + 1), C.meta(s));
      side.append(el('article', { class: 'row' }, C.art(s, { shape: 'square' }), text));
    }
    return el('div', { class: `lead lead--${variant}` }, hero, side);
  }

  const list = ids => el('ul', { class: 'more-list' }, ...ids.map(C.story).map(s => el('li', {}, C.headline(s, 3), C.meta(s))));

  // Sleek underline tabs: one panel per city, arrow keys / Home / End move between tabs.
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
      const name = C.L(tab.label);
      const button = el('button', { type: 'button', class: 'tab', role: 'tab', id: `${module.id}-tab-${i}`, 'aria-controls': `${module.id}-panel-${i}`, text: name });
      button.addEventListener('click', () => select(i, false));
      button.addEventListener('keydown', event => {
        const last = buttons.length - 1;
        const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[event.key];
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
      const cards = tab.stories.map(C.story).map(s => C.card(s, { shape: 'portrait' }));
      const panel = el('div', { class: 'tab-panel', role: 'tabpanel', id: `${module.id}-panel-${i}`, 'aria-labelledby': button.id },
        C.rail('cols-3', name, cards),
        el('a', { class: 'text-link', href: C.sectionUrl(module.id, tab.id), text: `${C.T.seeAll.replace('{city}', name)} →` }));
      buttons.push(button); panels.push(panel); tablist.append(button);
    });
    const wrap = el('div', { class: 'tabs-wrap' }, tablist, ...panels);
    select(0, false);
    return wrap;
  }

  const adSlot = name => el('div', { class: 'ad-slot', 'data-ad-slot': name, role: 'complementary', 'aria-label': C.T.adLabel }, el('span', { text: C.T.adLabel }));

  function renderModule(module) {
    const title = C.L(module.title);
    const section = el('section', { class: `module module-${module.type}`, id: module.id, 'aria-labelledby': `${module.id}-title` });
    section.append(el('div', { class: module.hideTitle ? 'visually-hidden' : 'module-head' },
      el('h2', { id: `${module.id}-title`, text: title }),
      module.intro ? el('p', { class: 'intro', text: C.L(module.intro) }) : null));
    const ids = module.stories || [];
    if (module.type === 'lead') section.append(lead(ids, 3, 'hero'));
    else if (module.type === 'split') section.append(lead(ids, 3, 'split'));
    else if (module.type === 'portrait') section.append(C.rail('pcards cols-5', title, ids.map(C.story).map(s => C.portraitCard(s))));
    else if (module.type === 'glass') section.append(C.rail('pcards glass cols-4', title, ids.map(C.story).map(s => C.portraitCard(s, { glass: true }))));
    else if (module.type === 'tabs') section.append(tabs(module, title));
    else if (module.type === 'list') section.append(list(ids));
    else section.append(C.rail(`cols-${Math.min(ids.length, 4)}`, title, ids.map(C.story).map(s => C.card(s))));
    return section;
  }

  function renderNav(modules) {
    const nav = document.querySelector('[data-food-nav]');
    if (!nav) return;
    nav.setAttribute('aria-label', C.T.navLabel);
    nav.replaceChildren(...modules.filter(m => m.nav).map(m => el('a', { href: `#${m.id}`, text: C.L(m.nav) })));
  }

  async function init() {
    try {
      data = await loadJson(root.dataset.layout);
      C = window.Cards.create(data);
      document.querySelectorAll('[data-food-title]').forEach(n => { n.textContent = C.T.title; });
      document.querySelectorAll('[data-food-descriptor]').forEach(n => { n.textContent = C.T.descriptor; });
      if (data.mastheadImage) {
        document.querySelector('.masthead').style.setProperty('--masthead-image', `url("${imageUrl(data.mastheadImage, 1600, '16:5')}")`);
      }
      const nodes = [];
      for (const module of data.modules) {
        nodes.push(renderModule(module));
        if (module.ad) nodes.push(adSlot(module.ad));
      }
      root.replaceChildren(...nodes);
      renderNav(data.modules);
      window.Parallax.init();
    } catch (error) {
      console.error(error);
      root.replaceChildren(el('p', { class: 'load-error', role: 'alert', text: (C && C.T.loadError) || 'Stories could not be loaded.' }));
    }
  }

  init();
})();
