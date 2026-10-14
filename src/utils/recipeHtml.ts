/**
 * Wraps recipe markup (from recipes.json) in the styled page shown inside a WebView.
 *
 * Content contract — what buildRecipeHtml expects and adapts to:
 *   - `<h3>` section titles ("Ingredientes:", "Preparação:").
 *   - `<ul><li>` ingredients. A `<li>` whose only content is a bold/strong label
 *     (e.g. "Marinada:") is treated as a sub-group heading for the items that follow.
 *   - `<ol><li>` numbered steps, or `<p><b>Stage:</b> …</p>` per-stage paragraphs —
 *     both are common in the data; each gets its own visual treatment below.
 *   - Recipes with no block markup at all (a handful of legacy entries) are wrapped
 *     in a single `<p>` so they get normal paragraph spacing instead of one run-on line.
 */
export function buildRecipeHtml(content: string, color: string): string {
  const hasBlockMarkup = /<(h3|ul|ol|p)[ >]/.test(content);
  const safeContent = hasBlockMarkup ? content : `<p>${content}</p>`;

  return `<html lang="pt"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${pageStyles(color)}</style>
</head><body>
<div class="recipe-container">
${safeContent}
<div class="footer">Panorama Lifestyle • Nutrition</div>
</div>
</body></html>`;
}

/** All styling for the recipe page, keyed off a small set of custom properties. */
function pageStyles(color: string): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');

:root {
  /* Brand accent, passed in per section (nutrition, workout, …). */
  --accent: ${color};
  --accent-wash: ${color}15;

  /* Neutral text/surface scale, independent of the accent. */
  --ink: #1E293B;
  --ink-soft: #475569;
  --ink-mute: #64748B;
  --ink-faint: #94A3B8;
  --surface: #FFFFFF;
  --bg: #F8FAFC;
  --border: #F1F5F9;
}

/* ---- Base ---- */

body {
  margin: 0;
  padding: 16px;
  font-family: 'Poppins', sans-serif;
  color: var(--ink-soft);
  background-color: var(--bg);
  -webkit-font-smoothing: antialiased;
}

.recipe-container {
  background: var(--surface);
  border-radius: 32px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
}

/* ---- Headings ---- */

h1 {
  margin: 0 0 24px;
  color: var(--ink);
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.5px;
  text-wrap: balance;
}

h2, h3 {
  display: flex;
  align-items: center;
  margin: 32px 0 16px;
  color: var(--accent);
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

h3 {
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 12px;
    background-color: var(--accent);
    border-radius: 2px;
    transform: rotate(45deg);
  }
}

/* ---- List items — shared baseline for both <ul> (ingredients) and <ol> (steps) ---- */

li {
  position: relative;
  padding-left: 32px;
  margin-bottom: 14px;
  color: var(--ink-soft);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
}

li:last-child {
  margin-bottom: 0;
}

li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 900;
  font-size: 18px;
  line-height: 1;
}

/* ---- Ingredients (<ul>) ---- */

ul {
  margin: 0;
  padding: 20px;
  list-style: none;
  background-color: var(--accent-wash);
  border-radius: 8px; /* container is 32px radius + 24px padding: 24 + 8 = 32, concentric */

  /* Some ingredient lists group items under a bold sub-heading (e.g. "Marinada:").
     Style the heading as a small label, and — where it has no text of its own,
     only siblings that follow it (e.g. "Especiarias:" in a longer list) — drop its
     indent and checkmark so it reads as a section break rather than another item. */
  & li {
    > b:first-child,
    > strong:first-child {
      display: block;
      margin-bottom: 3px;
      color: var(--accent);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    &:has(> b:only-child),
    &:has(> strong:only-child) {
      margin-top: 20px;
      padding-left: 0;

      &::before {
        content: none;
      }
    }

    &:first-child:has(> b:only-child),
    &:first-child:has(> strong:only-child) {
      margin-top: 0;
    }
  }
}

/* ---- Preparation, paragraph form (<p> per stage) ---- */

p {
  margin: 16px 0;
  color: var(--ink-mute);
  font-size: 16px;
  line-height: 1.8;
  text-wrap: pretty;

  /* Most recipes write their steps as a paragraph per stage instead of <ol> — give
     the bold stage name its own label line rather than letting it run into the text. */
  > b:first-child,
  > strong:first-child {
    display: block;
    margin-bottom: 4px;
    color: var(--accent);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

/* ---- Preparation, numbered form (<ol>) ---- */

ol {
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;

  /* Overrides only what differs from the shared baseline above — position and
     color are inherited unchanged; spacing and the ::before content are not. */
  & li {
    counter-increment: step;
    padding-left: 40px;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    &::before {
      content: counter(step);
      top: -2px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background-color: var(--accent-wash);
      color: var(--accent);
      font-size: 13px;
      font-weight: 700;
    }
  }
}

/* ---- Shared inline emphasis & footer ---- */

b, strong {
  color: var(--ink);
  font-weight: 700;
}

.footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  color: var(--ink-faint);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-align: center;
  text-transform: uppercase;
}
`;
}
