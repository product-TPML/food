/* Food section · shared story pieces (photo frame, kicker, meta, cards) used by the landing, story and section pages.
   Cards.create(data) reads <html lang> and the body brand class (brand-dh / brand-pv) and returns the builders. */
(function () {
  const { el, imageUrl, formatDate } = window.Food;
  const RATIO = { wide: '3:2', wide2: '16:9', '43': '4:3', square: '1:1', portrait: '4:5', tall: '2:3', hero: '16:9' };

  function create(data) {
    const lang = document.documentElement.lang === 'kn' ? 'kn' : 'en';
    const brand = document.body.classList.contains('brand-pv') ? 'pv' : 'dh';
    const locale = lang === 'kn' ? 'kn-IN' : 'en-IN';
    const T = data.strings[lang];
    const L = value => (value && typeof value === 'object' ? (value[lang] || value.en) : value);
    const put = (parent, ...nodes) => parent.append(...nodes.filter(Boolean)); // native append(null) would print "null"
    const story = id => ({ id, ...data.stories[id], ...data.stories[id][lang], type: (data.stories[id].en.cat || '').toLowerCase() });

    const homeUrl = brand === 'pv' ? 'index.pv.html' : 'index.html';
    const storyUrl = id => `story.html?id=${encodeURIComponent(id)}&b=${brand}`;
    const sectionUrl = (moduleId, tabId) => `section.html?m=${encodeURIComponent(moduleId)}&t=${encodeURIComponent(tabId)}&b=${brand}`;
    const recipeUrl = recipeId => `recipe.html?id=${encodeURIComponent(recipeId)}&lang=${lang}`; // opens in the page's language

    // Photo frame. The CDN crops to the frame's ratio; the tone gradient underneath shows if the photo fails.
    function art(s, { shape, link = true, eager = false, widths = [400, 800, 1200], sizes = '(max-width: 1023px) 72vw, 40vw' } = {}) {
      const kind = shape || s.shape;
      const frame = el(link ? 'a' : 'div', { class: `art ar-${kind}`, href: link ? storyUrl(s.id) : null, tabindex: link ? '-1' : null, 'aria-hidden': 'true' });
      const [from, to] = data.tones[s.tone % data.tones.length];
      frame.style.setProperty('--t1', from);
      frame.style.setProperty('--t2', to);
      if (s.img) {
        const ratio = RATIO[kind];
        const url = width => imageUrl(s.img, width, ratio);
        const mid = widths[Math.min(1, widths.length - 1)];
        const img = el('img', { alt: '', width: mid, height: Math.round(mid * ratio.split(':')[1] / ratio.split(':')[0]), decoding: 'async', loading: eager ? 'eager' : 'lazy', fetchpriority: eager ? 'high' : null,
          src: url(mid), srcset: widths.map(w => `${url(w)} ${w}w`).join(', '), sizes });
        img.addEventListener('error', () => { img.remove(); frame.classList.remove('has-img'); });
        frame.classList.add('has-img');
        frame.append(img);
      }
      return frame;
    }

    function tags(s) {
      const label = s.kind ? T.kinds[s.kind] : s.cat;
      return label ? el('p', { class: 'tags' }, el('span', { class: `tag tag-${s.kind || s.type || 'story'}`, text: label })) : null;
    }

    function meta(s) {
      // Cities show the area; everything else shows author at the left and the date at the right edge.
      if (s.area) return el('p', { class: 'meta' }, el('span', { class: 'author', text: L(s.area) }));
      return el('p', { class: 'meta' },
        el('span', { class: 'author', text: `${T.by} ${s.author}` }),
        el('time', { class: 'date', datetime: s.date, text: formatDate(Date.parse(s.date), locale) }));
    }

    const headline = (s, level) => el(`h${level}`, { class: 'headline' }, el('a', { href: storyUrl(s.id), text: s.title }));
    const dek = s => (s.dek ? el('p', { class: 'dek', text: s.dek }) : null);

    function card(s, { shape, level = 3 } = {}) {
      const body = el('div', { class: 'card-body' });
      put(body, tags(s), headline(s, level), dek(s), meta(s));
      return el('article', { class: 'card' }, art(s, { shape }), body);
    }

    // Full-bleed portrait card, text on a dark gradient at the bottom (The Hindu style).
    // glass: a 4:5 card whose text sits in a frosted panel below the photo; the panel shows a blurred continuation of the photo.
    function portraitCard(s, { level = 3, glass = false } = {}) {
      const link = el('a', { class: 'pcard-link', href: storyUrl(s.id) });
      const text = el('div', { class: 'pcard-text' });
      put(text, tags(s), el(`h${level}`, { class: 'headline', text: s.title }), meta(s));
      if (glass && s.img) text.style.setProperty('--glass-img', `url("${imageUrl(s.img, 400, RATIO.portrait)}")`);
      link.append(art(s, { shape: glass ? 'portrait' : 'tall', link: false }), text);
      return el('article', { class: glass ? 'pcard pcard--glass' : 'pcard' }, link);
    }

    // A row of cards: a grid on desktop, a swipeable scroll-snap carousel below 1024px.
    const rail = (className, label, nodes) => el('div', { class: `rail ${className}`, role: 'group', 'aria-label': label, tabindex: '0' }, ...nodes);

    return { lang, brand, locale, T, L, put, story, homeUrl, storyUrl, sectionUrl, recipeUrl, art, tags, meta, headline, dek, card, portraitCard, rail };
  }

  window.Cards = { create, RATIO };
})();
