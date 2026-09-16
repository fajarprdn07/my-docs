const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const pdfParse = require('pdf-parse');
const { marked } = require('marked');

const DOCS_DIR = './docs';
const OUTPUT_DIR = './output';
const SITE_URL = process.env.SITE_URL || 'http://localhost:8000';
const TEXT_THRESHOLD = 150;
const TESSERACT_LANG = 'ind+eng';
const PDFJS_VERSION = '3.11.174';
const PDFJS_URL = 'https://github.com/mozilla/pdf.js/releases/download/v' + PDFJS_VERSION + '/pdfjs-' + PDFJS_VERSION + '-dist.zip';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function slugify(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/[^a-zA-Z0-9_-]/g, '_');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function processPDF(filePath) {
  const filename = path.basename(filePath);
  console.log('  📄 PDF: ' + filename);
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    const numPages = data.numpages || 1;
    const avg = data.text ? data.text.length / numPages : 0;

    if (avg > TEXT_THRESHOLD && data.text && data.text.trim().length > 100) {
      console.log('     -> Text-based (' + Math.round(avg) + ' chars/page)');
      return { text: data.text, pages: numPages, method: 'text' };
    }

    console.log('     -> Scanned detected, running OCR...');
    const tmp = '/tmp/ocr-' + Date.now();
    ensureDir(tmp);
    try {
      execSync('pdftoppm -png -r 300 "' + filePath + '" "' + tmp + '/page"', { stdio: 'pipe', timeout: 300000 });
      const pages = fs.readdirSync(tmp).filter(f => f.endsWith('.png')).sort();
      let ocr = '';
      for (const p of pages) {
        try {
          const res = execSync('tesseract "' + path.join(tmp, p) + '" stdout -l ' + TESSERACT_LANG + ' --psm 6 2>/dev/null', { timeout: 120000 }).toString();
          ocr += res + '\n\n';
        } catch (e) {
          console.log('     Warning: OCR page failed ' + p);
        }
      }
      console.log('     -> OCR done (' + pages.length + ' pages)');
      return { text: ocr || data.text || '', pages: pages.length || numPages, method: 'ocr' };
    } finally {
      try { execSync('rm -rf "' + tmp + '"'); } catch(e){}
    }
  } catch (err) {
    console.error('     ❌ Error parsing PDF: ' + err.message);
    return { text: '', pages: 1, method: 'error' };
  }
}

function processMD(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  console.log('  📝 MD: ' + path.basename(filePath));
  const html = marked.parse ? marked.parse(raw) : marked(raw);
  return { text: raw, html: html, method: 'markdown' };
}

function processImage(filePath) {
  console.log('  🖼️  IMG OCR: ' + path.basename(filePath));
  try {
    const text = execSync('tesseract "' + filePath + '" stdout -l ' + TESSERACT_LANG + ' --psm 6 2>/dev/null', { timeout: 120000 }).toString();
    return { text: text, method: 'ocr-image' };
  } catch (e) {
    console.error('     ❌ OCR error: ' + e.message);
    return { text: '', method: 'error' };
  }
}

function makeIndexHTML(docs) {
  const docList = docs.map(d => {
    const icon = d.type === 'pdf' ? '📄' : d.type === 'md' ? '📝' : '🖼️';
    return '<div class="card">' +
      '<div class="icon">' + icon + '</div>' +
      '<div class="info">' +
        '<a href="view/' + d.slug + '.html">' + escapeHtml(d.filename) + '</a>' +
        '<div class="meta">' + (d.pages ? d.pages + ' pages · ' : '') + d.method.toUpperCase() + '</div>' +
      '</div></div>';
  }).join('\n');

  return '<!DOCTYPE html>' +
'<html lang="id">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'  <title>Document Repository</title>' +
'  <style>' +
'    * { margin:0; padding:0; box-sizing:border-box; }' +
'    body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:#f4f6f8; color:#333; }' +
'    .wrap { max-width:900px; margin:0 auto; padding:2.5rem 1rem; }' +
'    h1 { font-size:26px; margin-bottom:6px; color:#111; }' +
'    .subtitle { color:#666; margin-bottom:1.5rem; font-size:14px; }' +
'    .search-box { width:100%; padding:14px 18px; font-size:16px; border:2px solid #ccd0d5; border-radius:8px; margin-bottom:1rem; outline:none; }' +
'    .search-box:focus { border-color:#0066cc; }' +
'    .status-bar { font-size:13px; color:#666; margin-bottom:1rem; min-height:20px; }' +
'    .card { display:flex; align-items:flex-start; gap:1rem; background:#fff; padding:1.2rem; border-radius:8px; margin-bottom:0.75rem; box-shadow:0 1px 3px rgba(0,0,0,0.08); }' +
'    .icon { font-size:2rem; line-height:1; }' +
'    .info { flex:1; }' +
'    .info a { font-weight:600; color:#0066cc; text-decoration:none; font-size:17px; }' +
'    .info a:hover { text-decoration:underline; }' +
'    .meta { font-size:12px; color:#888; margin-top:4px; }' +
'    .snippet { font-size:13px; color:#444; margin-top:8px; line-height:1.5; background:#f9f9f9; padding:6px 10px; border-radius:4px; }' +
'    .snippet mark { background:#ffe58f; padding:0 2px; border-radius:2px; font-weight:bold; }' +
'    .empty { text-align:center; padding:3rem; color:#888; }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="wrap">' +
'    <h1>📚 Document Repository</h1>' +
'    <p class="subtitle">' + docs.length + ' Dokumen Tersedia · Full-Text Search · AI-Ready</p>' +
'    <input type="text" class="search-box" id="search" placeholder="Cari kata atau kalimat di dalam dokumen..." autocomplete="off">' +
'    <div class="status-bar" id="status"></div>' +
'    <div id="list">' + docList + '</div>' +
'  </div>' +
'  <script>' +
'    var docsData = [];' +
'    fetch("docs-data.json")' +
'      .then(function(r){ return r.json(); })' +
'      .then(function(data){ docsData = data; })' +
'      .catch(function(e){ console.error(e); });' +
'    document.getElementById("search").addEventListener("input", function() {' +
'      var q = this.value.trim().toLowerCase();' +
'      var statusEl = document.getElementById("status");' +
'      var listEl = document.getElementById("list");' +
'      if (!q || q.length < 2) {' +
'        statusEl.textContent = "";' +
'        renderAll();' +
'        return;' +
'      }' +
'      var matches = [];' +
'      docsData.forEach(function(doc) {' +
'        var textLower = (doc.text || "").toLowerCase();' +
'        var titleLower = (doc.filename || "").toLowerCase();' +
'        var pos = textLower.indexOf(q);' +
'        if (pos !== -1 || titleLower.indexOf(q) !== -1) {' +
'          var snippet = "";' +
'          if (pos !== -1) {' +
'            var start = Math.max(0, pos - 60);' +
'            var end = Math.min(doc.text.length, pos + q.length + 60);' +
'            snippet = (start > 0 ? "..." : "") + doc.text.substring(start, end) + (end < doc.text.length ? "..." : "");' +
'          }' +
'          matches.push({ doc: doc, snippet: snippet });' +
'        }' +
'      });' +
'      statusEl.textContent = "Ditemukan " + matches.length + " dokumen untuk \\"" + q + "\\"";' +
'      if (!matches.length) {' +
'        listEl.innerHTML = \'<div class="empty">Tidak ditemukan hasil.</div>\';' +
'        return;' +
'      }' +
'      listEl.innerHTML = matches.map(function(item) {' +
'        var d = item.doc;' +
'        var icon = d.type === "pdf" ? "📄" : d.type === "md" ? "📝" : "🖼️";' +
'        var snipHtml = "";' +
'        if (item.snippet) {' +
'          var safeSnippet = item.snippet.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");' +
'          snipHtml = \'<div class="snippet">\' + safeSnippet + \'</div>\';' +
'        }' +
'        return \'<div class="card">\' +' +
'          \'<div class="icon">\' + icon + \'</div>\' +' +
'          \'<div class="info">\' +' +
'            \'<a href="view/\' + d.slug + \'.html">\' + d.filename + \'</a>\' +' +
'            \'<div class="meta">\' + (d.pages ? d.pages + " pages · " : "") + d.method.toUpperCase() + \'</div>\' +' +
'            snipHtml +' +
'          \'</div></div>\';' +
'      }).join("");' +
'    });' +
'    function renderAll() {' +
'      var listEl = document.getElementById("list");' +
'      listEl.innerHTML = docsData.map(function(d) {' +
'        var icon = d.type === "pdf" ? "📄" : d.type === "md" ? "📝" : "🖼️";' +
'        return \'<div class="card">\' +' +
'          \'<div class="icon">\' + icon + \'</div>\' +' +
'          \'<div class="info">\' +' +
'            \'<a href="view/\' + d.slug + \'.html">\' + d.filename + \'</a>\' +' +
'            \'<div class="meta">\' + (d.pages ? d.pages + " pages · " : "") + d.method.toUpperCase() + \'</div>\' +' +
'          \'</div></div>\';' +
'      }).join("");' +
'    }' +
'  </script>' +
'</body>' +
'</html>';
}

function makeViewerHTML(doc) {
  let body = '';
  if (doc.type === 'pdf') {
    const pdfPath = '../docs/' + encodeURIComponent(doc.filename);
    const pdfJsViewerUrl = '../pdfjs/web/viewer.html?file=' + encodeURIComponent('../../docs/' + doc.filename);

    body = '<div class="toolbar">' +
      '<span>📄 ' + escapeHtml(doc.filename) + '</span>' +
      '<a href="' + pdfPath + '" class="btn" download>⬇ Download PDF</a>' +
      '<a href="' + pdfPath + '" class="btn" target="_blank">🌐 Buka File Asli</a>' +
      '<a href="../text/' + doc.slug + '.txt" class="btn" target="_blank">📃 Plain Text</a>' +
    '</div>' +
    '<iframe src="' + pdfJsViewerUrl + '" style="width:100%;height:calc(100vh - 54px);border:none" title="PDF Viewer"></iframe>';
  } else if (doc.type === 'md') {
    body = '<div class="toolbar">' +
      '<span>📝 ' + escapeHtml(doc.filename) + '</span>' +
      '<a href="../docs/' + encodeURIComponent(doc.filename) + '" class="btn" download>⬇ Download</a>' +
      '<a href="../text/' + doc.slug + '.txt" class="btn" target="_blank">📃 Plain Text</a>' +
    '</div><div class="md">' + doc.html + '</div>';
  } else {
    body = '<div class="toolbar">' +
      '<span>🖼️ ' + escapeHtml(doc.filename) + '</span>' +
      '<a href="../docs/' + encodeURIComponent(doc.filename) + '" class="btn" download>⬇ Download</a>' +
      '<a href="../text/' + doc.slug + '.txt" class="btn" target="_blank">📃 OCR Text</a>' +
    '</div><div style="text-align:center;padding:2rem"><img src="../docs/' + encodeURIComponent(doc.filename) + '" style="max-width:100%;max-height:70vh;border-radius:8px"></div><details style="max-width:800px;margin:1rem auto;padding:1rem;background:#fff;border-radius:8px"><summary>📃 Lihat Hasil OCR Teks</summary><pre style="white-space:pre-wrap;margin-top:1rem">' + escapeHtml(doc.text) + '</pre></details>';
  }

  return '<!DOCTYPE html>' +
'<html lang="id">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'  <title>' + escapeHtml(doc.filename) + '</title>' +
'  <style>' +
'    * { margin:0; padding:0; box-sizing:border-box; }' +
'    body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:#f4f6f8; overflow:hidden; }' +
'    .toolbar { display:flex; align-items:center; gap:0.75rem; padding:10px 16px; background:#1e293b; color:#fff; flex-wrap:wrap; }' +
'    .toolbar span { font-weight:600; font-size:14px; margin-right:auto; }' +
'    .btn { color:#fff; text-decoration:none; background:#2563eb; padding:5px 10px; border-radius:4px; font-size:12px; }' +
'    .btn:hover { background:#1d4ed8; }' +
'    .md { max-width:800px; margin:2rem auto; padding:2rem; background:#fff; border-radius:8px; line-height:1.8; box-shadow:0 1px 3px rgba(0,0,0,0.1); overflow-y:auto; height:calc(100vh - 100px); }' +
'    .md h1, .md h2, .md h3 { margin:1.5rem 0 0.5rem; }' +
'    .md pre { background:#f1f5f9; padding:1rem; border-radius:4px; overflow-x:auto; }' +
'    .md code { background:#f1f5f9; padding:2px 6px; border-radius:3px; }' +
'    .back { color:#94a3b8; text-decoration:none; font-size:13px; font-weight:500; margin-right:8px; }' +
'    .back:hover { color:#fff; }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="toolbar" style="background:#0f172a; border-bottom:1px solid #334155;">' +
'    <a href="../index.html" class="back">← Kembali ke Beranda</a>' +
'  </div>' +
  body +
'</body>' +
'</html>';
}

async function build() {
  console.log('🚀 Mulai proses build...');
  if (fs.existsSync(OUTPUT_DIR)) fs.rmSync(OUTPUT_DIR, { recursive: true });
  ensureDir(OUTPUT_DIR + '/docs');
  ensureDir(OUTPUT_DIR + '/view');
  ensureDir(OUTPUT_DIR + '/text');

  console.log('📦 Mendownload PDF.js Viewer...');
  try {
    execSync('curl -sL -o /tmp/pdfjs.zip "' + PDFJS_URL + '"', { timeout: 60000 });
    execSync('unzip -q -o /tmp/pdfjs.zip -d ' + OUTPUT_DIR + '/pdfjs');
    console.log('   ✅ PDF.js siap.');
  } catch(e) {
    console.log('   ⚠️ Gagal download PDF.js via curl, viewer fallback default.');
  }

  const docs = [];
  const files = fs.existsSync(DOCS_DIR) ? fs.readdirSync(DOCS_DIR) : [];

  for (const file of files) {
    if (file.startsWith('.')) continue;
    const fp = path.join(DOCS_DIR, file);
    if (!fs.statSync(fp).isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    const slug = slugify(file);
    let result;

    try {
      if (ext === '.pdf') {
        result = await processPDF(fp);
      } else if (ext === '.md') {
        result = processMD(fp);
      } else if (['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.webp'].includes(ext)) {
        result = processImage(fp);
      } else {
        console.log('  ⏭️ Lewati format tidak didukung: ' + file);
        continue;
      }

      const type = ext === '.pdf' ? 'pdf' : ext === '.md' ? 'md' : 'image';
      const doc = {
        filename: file,
        slug: slug,
        type: type,
        text: result.text || '',
        html: result.html || null,
        pages: result.pages || 1,
        method: result.method
      };
      docs.push(doc);

      fs.copyFileSync(fp, OUTPUT_DIR + '/docs/' + file);
      fs.writeFileSync(OUTPUT_DIR + '/text/' + slug + '.txt', result.text || '', 'utf-8');
      fs.writeFileSync(OUTPUT_DIR + '/view/' + slug + '.html', makeViewerHTML(doc), 'utf-8');
    } catch(err) {
      console.error('  ❌ Gagal memproses file ' + file + ':', err);
    }
  }

  console.log('💾 Menyimpan database dokumen untuk pencarian & AI...');
  fs.writeFileSync(OUTPUT_DIR + '/docs-data.json', JSON.stringify(docs.map(d => ({
    filename: d.filename,
    slug: d.slug,
    type: d.type,
    pages: d.pages,
    method: d.method,
    text: d.text
  }))), 'utf-8');

  fs.writeFileSync(OUTPUT_DIR + '/index.html', makeIndexHTML(docs), 'utf-8');

  const llms = '# Document Repository\n\n' + docs.length + ' documents.\n\n## Documents\n\n' + docs.map(d => '- [' + d.filename + '](' + SITE_URL + '/view/' + d.slug + '.html) | Plain text: ' + SITE_URL + '/text/' + d.slug + '.txt').join('\n') + '\n';
  fs.writeFileSync(OUTPUT_DIR + '/llms.txt', llms, 'utf-8');

  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + docs.map(d => '  <url><loc>' + SITE_URL + '/view/' + d.slug + '.html</loc></url>').join('\n') + '\n</urlset>';
  fs.writeFileSync(OUTPUT_DIR + '/sitemap.xml', sitemap, 'utf-8');
  fs.writeFileSync(OUTPUT_DIR + '/robots.txt', 'User-agent: *\nAllow: /\nSitemap: ' + SITE_URL + '/sitemap.xml\n', 'utf-8');

  console.log('🎉 Selesai! ' + docs.length + ' dokumen berhasil diproses.');
}

build().catch(err => {
  console.error('Fatal build error:', err);
  process.exit(1);
});