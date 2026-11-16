/* Food section · shared helpers. Plain script; exposes window.Food. */
(function () {
  const IMG_HOST = 'https://cf-images.assettype.com/';

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value === true ? '' : value);
    }
    node.append(...children.filter(child => child != null));
    return node;
  }

  // Captions arrive as small HTML snippets; keep the text only.
  function plainText(html) {
    if (!html) return '';
    return (new DOMParser().parseFromString(html, 'text/html').body.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function imageUrl(key, width, ratio) {
    return `${IMG_HOST}${key}?w=${width}&ar=${ratio}&auto=format`;
  }

  function picture(story, { ratio = '3:2', widths = [400, 640, 960, 1280], sizes, eager = false, width = 640, height = 427 } = {}) {
    if (!story.imageKey) return null;
    const img = el('img', {
      alt: '', width, height, decoding: 'async',
      loading: eager ? 'eager' : 'lazy', fetchpriority: eager ? 'high' : null,
      src: imageUrl(story.imageKey, widths[1] || widths[0], ratio),
      srcset: widths.map(w => `${imageUrl(story.imageKey, w, ratio)} ${w}w`).join(', '),
      sizes
    });
    img.addEventListener('error', () => img.remove()); // the tinted placeholder underneath stays
    return img;
  }

  function formatDate(ms, locale) {
    if (!ms) return '';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(ms));
  }

  function authorLine(story, strings) {
    const names = (story.authors || []).map(a => (a.name || '').replace(/[​\s]+/g, ' ').trim()).filter(Boolean);
    return names.length ? `${strings.by} ${names.slice(0, 2).join(', ')}` : '';
  }

  async function loadJson(path) {
    const response = await fetch(path, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
  }

  // Every recipe draft listed in content/recipe-index.json. A missing or broken file is skipped, not fatal.
  async function loadRecipes() {
    const index = await loadJson('content/recipe-index.json');
    const files = await Promise.all(index.files.map(file => loadJson(`content/${file}`).catch(error => { console.warn(`Recipe file skipped: ${file}`, error); return { recipes: [] }; })));
    return files.flatMap(file => file.recipes || []);
  }

  window.Food = { el, plainText, imageUrl, picture, formatDate, authorLine, loadJson, loadRecipes };
})();
