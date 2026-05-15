/* Minimal kid-friendly Markdown renderer (no external deps).
   Supports: # headings, paragraphs, bold/italic, inline code, code fences,
   images, links, blockquotes (incl. lines starting "> 🐢 / 💡 / 🌍 / 🎯 / 🏆 / ⚠️"),
   ordered/unordered lists, GFM tables, horizontal rules. ASCII art in fenced "text"
   blocks renders with a light style. */
(function () {
  'use strict';

  function esc(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function inline(text) {
    let s = esc(text);
    // images first  ![alt](url)
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      (_m, alt, url) => `<img src="${url}" alt="${alt}" loading="lazy">`);
    // links [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      (_m, t, u) => `<a href="${u}" ${u.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${t}</a>`);
    // inline code `...`
    s = s.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`);
    // bold **...**
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // italic *...*  (avoid breaking already-converted **...**)
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    return s;
  }

  function renderTable(lines) {
    // lines: header, separator, ...rows
    const head = lines[0].split('|').slice(1, -1).map(s => s.trim());
    const rows = lines.slice(2).map(r => r.split('|').slice(1, -1).map(s => s.trim()));
    let out = '<table><thead><tr>';
    out += head.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>';
    for (const r of rows) {
      out += '<tr>' + r.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>';
    }
    return out + '</tbody></table>';
  }

  window.renderMarkdown = function (md) {
    if (!md) return '';
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    let out = [];
    let i = 0;

    function flushParagraph(buf) {
      if (!buf.length) return;
      out.push('<p>' + inline(buf.join(' ')) + '</p>');
    }

    while (i < lines.length) {
      const line = lines[i];

      // Code fence ```lang
      if (/^```/.test(line)) {
        const lang = line.replace(/^```/, '').trim();
        i++;
        const codeLines = [];
        while (i < lines.length && !/^```/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // closing fence
        const code = esc(codeLines.join('\n'));
        const cls = (lang === 'text' || lang === '') ? 'text-ascii' : `lang-${lang}`;
        out.push(`<pre class="${cls}"><code>${code}</code></pre>`);
        continue;
      }

      // Headings
      const mH = line.match(/^(#{1,4})\s+(.*)$/);
      if (mH) {
        const lv = mH[1].length;
        out.push(`<h${lv}>${inline(mH[2])}</h${lv}>`);
        i++;
        continue;
      }

      // Horizontal rule
      if (/^---+\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

      // Blockquote (multi-line)
      if (/^>\s?/.test(line)) {
        const qLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          qLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        out.push(`<blockquote>${inline(qLines.join(' '))}</blockquote>`);
        continue;
      }

      // GFM Table (line is | header | header | then | --- | --- |)
      if (/^\|.+\|$/.test(line) && lines[i + 1] && /^\|[\s|:-]+\|$/.test(lines[i + 1])) {
        const tLines = [];
        while (i < lines.length && /^\|.+\|$/.test(lines[i])) {
          tLines.push(lines[i]);
          i++;
        }
        out.push(renderTable(tLines));
        continue;
      }

      // Unordered list
      if (/^[-*]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^[-*]\s+/, ''));
          i++;
        }
        out.push('<ul>' + items.map(it => `<li>${inline(it)}</li>`).join('') + '</ul>');
        continue;
      }

      // Ordered list
      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s+/, ''));
          i++;
        }
        out.push('<ol>' + items.map(it => `<li>${inline(it)}</li>`).join('') + '</ol>');
        continue;
      }

      // Blank line
      if (!line.trim()) { i++; continue; }

      // Paragraph (gather contiguous non-empty non-special lines)
      const buf = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,4})\s/.test(lines[i])
        && !/^>\s?/.test(lines[i]) && !/^```/.test(lines[i])
        && !/^---+\s*$/.test(lines[i])
        && !/^[-*]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i])
        && !/^\|.+\|$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      flushParagraph(buf);
    }
    return out.join('\n');
  };
})();
