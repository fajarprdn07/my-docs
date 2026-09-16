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
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(filename) {
  return path.basename(filename, path.extname(filename)).replace(/[^a-zA-Z0-9_-]/g, '_');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function processPDF(filePath) {
  const filename = path.basename(filePath);
  console.log('  PDF: ' + filename);
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  const avg = data.numpages > 0 ? data.text.length / data.numpages : 0;

  if (avg > TEXT_THRESHOLD && data.text.trim().length > 100) {
    console.log('    -> Text-based (' + Math.round(avg) + ' chars/page)');
    return { text: data.text, pages: data.numpages, method: 'text' };
  }

  console.log('    -> Scanned, running OCR...');
  const tmp = '/tmp/ocr-' + Date.now();
  ensureDir(tmp);
  try {
    execSync('pdftoppm -png -r 300 "' + filePath + '" "' + tmp + '/page"', { stdio: 'pipe', timeout: 300000 });
    const pages = fs.readdirSync(tmp).filter(function(f) { return f.endsWith('.png'); }).sort();
    let ocr = '';
    for (const p of pages) {
      ocr += execSync('tesseract "' + path.join(tmp, p) + '" stdout -l ' + TESSERACT_LANG + ' --psm 6 2>/dev/null', { timeout: 120000 }).toString() + '\n\n';
    }
    console.log('    -> OCR done (' + pages.length + ' pages)');
    return { text: ocr, pages: pages.length, method: 'ocr' };
  } finally {
    execSync('rm -rf "' + tmp + '"');
  }
}

function processMD(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  console.log('  MD: ' + path.basename(filePath));
  return { text: raw, html: marked(raw), method: 'markdown' };
}

function processImage(filePath) {
  console.log('  IMG OCR: ' + path.basename(filePath));
  const text = execSync('tesseract "' + filePath + '" stdout -l ' + TESSERACT_LANG + ' --psm 6 2>/dev/null', { timeout: 120000 }).toString();
  return { text: text, method: 'ocr-image' };
}

function makeIndexHTML(docs) {
  var list = docs.map(function(d) {
    var icon = d.type === 'pdf' ? '📄' : d.type === 'md' ? '📝' : '🖼️';
    return '<div class="card" data-id="' + d.slug + '"><div class="icon">' + icon + '</div><div class="info"><a href="view/' + d.slug + '.html">' + escapeHtml(d.filename) + '</a><div class="meta">' + (d.pages ? d.pages + ' pages · ' : '') + d.method + '</div><div class="snippet" id="snip-' + d.slug + '"></div></div></div>';
  }).join('\n');

  return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Docs</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#f5f5f5;color:#333}.wrap{max-width:900px;margin:0 auto;padding:2rem 1rem}h1{margin-bottom:1rem}.search{width:100%;padding:14px 20px;font-size:16px;border:2px solid #ddd;border-radius:8px;margin-bottom:1.5rem;outline:none}.search:focus{border-color:#0066cc}.info-bar{color:#666;margin-bottom:1rem;font-size:14px}.card{display:flex;align-items:center;gap:1rem;background:#fff;padding:1rem 1.5rem;border-radius:8px;margin-bottom:.5rem;box-shadow:0 1px 3px rgba(0,0,0,.1)}.card:hover{box-shadow:0 3px 10px rgba(0,0,0,.15)}.icon{font-size:2rem}.info a{font-weight:600;color:#0066cc;text-decoration:none}.info a:hover{text-decoration:underline}.meta{font-size:13px;color:#888;margin-top:4px}.snippet{font-size:13px;color:#555;margin-top:6px}.snippet mark{background:#fff3cd;padding:0 2px;border-radius:2px}.empty{text-align:center;color:#888;padding:3rem}</style></head><body><div class="wrap"><h1>📚 My Document Repository</h1><p style="color:#666;margin-bottom:2rem">' + docs.length + ' documents · Full-text search · AI-ready</p><input type="text" class="search" id="q" placeholder="Cari di dalam semua dokumen..." autocomplete="off"><div class="info-bar" id="info"></div><div id="list">' + list + '</div></div><script src="https://cdn.jsdelivr.net/npm/flexsearch@0.7.43/dist/flexsearch.bundle.min.js"></script><script>var docs=' + JSON.stringify(docs.map(function(d){return{id:d.slug,filename:d.filename,type:d.type,pages:d.pages,method:d.method}})) + ';var idx;fetch("search-index.json").then(function(r){return r.json()}).then(function(data){idx=new FlexSearch.Document({document:{id:"id",index:["content"]},tokenize:"full"});idx.import(data)}).catch(function(){});document.getElementById("q").addEventListener("input",function(){var q=this.value.trim();var el=document.getElementById("list");var info=document.getElementById("info");if(q.length<2){renderAll();info.textContent="";return}if(!idx)return;var res=idx.search(q,{limit:50,enrich:true});var ids=new Set();var snips={};res.forEach(function(g){g.result.forEach(function(r){ids.add(r.doc.id);var t=r.doc.content;var i=t.toLowerCase().indexOf(q.toLowerCase());if(i!==-1){var s=Math.max(0,i-80);var e=Math.min(t.length,i+q.length+80);var sn=(s>0?"...":"")+t.substring(s,e)+(e<t.length?"...":"");var re=new RegExp("("+q.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\\\$&")+")","gi");snips[r.doc.id]=sn.replace(re,"<mark>$1</mark>")}})});if(!ids.size){el.innerHTML=\'<div class="empty">Tidak ditemukan</div>\';info.textContent="0 hasil";return}info.textContent=ids.size+" hasil";el.innerHTML=docs.filter(function(d){return ids.has(d.id)}).map(function(d){var icon=d.type==="pdf"?"📄":d.type==="md"?"📝":"🖼️";return\'<div class="card"><div class="icon">\'+icon+\'</div><div class="info"><a href="view/\'+d.id+\'.html">\'+d.filename+\'</a><div class="meta">\'+(d.pages?d.pages+" pages · ":"")+d.method+\'</div>\'+(snips[d.id]?\'<div class="snippet">\'+snips[d.id]+\'</div>\':"")+\'</div></div>\'}).join("")});function renderAll(){document.getElementById("list").innerHTML=docs.map(function(d){var icon=d.type==="pdf"?"📄":d.type==="md"?"📝":"🖼️";return\'<div class="card"><div class="icon">\'+icon+\'</div><div class="info"><a href="view/\'+d.id+\'.html">\'+d.filename+\'</a><div class="meta">\'+(d.pages?d.pages+" pages · ":"")+d.method+\'</div></div></div>\'}).join("")}</script></body></html>';
}

function makeViewerHTML(doc) {
  var body = '';
  if (doc.type === 'pdf') {
    body = '<div class="toolbar"><span>📄 ' + escapeHtml(doc.filename) + '</span><a href="../docs/' + encodeURIComponent(doc.filename) + '" class="btn">⬇ Download</a><a href="../text/' + doc.slug + '.txt" class="btn">📃 Text</a></div><iframe src="../pdfjs/web/viewer.html?file=' + encodeURIComponent('../docs/' + doc.filename) + '" style="width:100%;height:calc(100vh - 52px);border:none"></iframe><div style="padding:10px 20px;background:#fff3cd;font-size:13px">💡 Gunakan tombol search (🔍) di toolbar PDF viewer untuk mencari di dalam dokumen</div>';
  } else if (doc.type === 'md') {
    body = '<div class="toolbar"><span>📝 ' + escapeHtml(doc.filename) + '</span><a href="../docs/' + encodeURIComponent(doc.filename) + '" class="btn">⬇ Download</a></div><div class="md">' + doc.html + '</div>';
  } else {
    body = '<div class="toolbar"><span>🖼️ ' + escapeHtml(doc.filename) + '</span><a href="../docs/' + encodeURIComponent(doc.filename) + '" class="btn">⬇ Download</a></div><div style="text-align:center;padding:2rem"><img src="../docs/' + encodeURIComponent(doc.filename) + '" style="max-width:100%;max-height:70vh;border-radius:8px"></div><details style="max-width:800px;margin:1rem auto;padding:1rem;background:#fff;border-radius:8px"><summary>📃 OCR Result</summary><pre style="white-space:pre-wrap;margin-top:1rem">' + escapeHtml(doc.text) + '</pre></details>';
  }
  return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + escapeHtml(doc.filename) + '</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#f5f5f5}.toolbar{display:flex;align-items:center;gap:1rem;padding:12px 20px;background:#1a1a2e;color:#fff;flex-wrap:wrap}.toolbar span{font-weight:600}.btn{color:#fff;text-decoration:none;background:#0066cc;padding:6px 12px;border-radius:4px;font-size:13px}.btn:hover{background:#0052a3}.md{max-width:800px;margin:2rem auto;padding:2rem;background:#fff;border-radius:8px;line-height:1.8}.md h1,.md h2,.md h3{margin:1.5rem 0 .5rem}.md pre{background:#f4f4f4;padding:1rem;border-radius:4px;overflow-x:auto}.md code{background:#f4f4f4;padding:2px 6px;border-radius:3px}.md img{max-width:100%}.back{display:inline-block;padding:10px 20px;color:#0066cc;text-decoration:none;font-size:14px}</style></head><body><a href="../index.html" class="back">← Kembali</a>' + body + '</body></html>';
}

async function build() {
  console.log('Starting build...');
  if (fs.existsSync(OUTPUT_DIR)) fs.rmSync(OUTPUT_DIR, { recursive: true });
  ensureDir(OUTPUT_DIR + '/docs');
  ensureDir(OUTPUT_DIR + '/view');
  ensureDir(OUTPUT_DIR + '/text');

  console.log('Downloading PDF.js...');
  try {
    execSync('curl -sL -o /tmp/pdfjs.zip "' + PDFJS_URL + '"', { timeout: 60000 });
    execSync('unzip -q -o /tmp/pdfjs.zip -d ' + OUTPUT_DIR + '/pdfjs');
    console.log('  PDF.js ready');
  } catch(e) { console.log('  PDF.js download failed'); }

  var docs = [];
  var files = fs.existsSync(DOCS_DIR) ? fs.readdirSync(DOCS_DIR) : [];

  for (const file of files) {
    if (file.startsWith('.')) continue;
    var fp = path.join(DOCS_DIR, file);
    if (!fs.statSync(fp).isFile()) continue;
    var ext = path.extname(file).toLowerCase();
    var slug = slugify(file);
    var result;

    try {
      if (ext === '.pdf') result = await processPDF(fp);
      else if (ext === '.md') result = processMD(fp);
      else if (['.png','.jpg','.jpeg','.tiff','.bmp','.webp'].includes(ext)) result = processImage(fp);
      else { console.log('  Skip: ' + file); continue; }

      var type = ext === '.pdf' ? 'pdf' : ext === '.md' ? 'md' : 'image';
      var doc = { filename: file, slug: slug, type: type, text: result.text, html: result.html || null, pages: result.pages || null, method: result.method };
      docs.push(doc);

      fs.copyFileSync(fp, OUTPUT_DIR + '/docs/' + file);
      fs.writeFileSync(OUTPUT_DIR + '/text/' + slug + '.txt', result.text, 'utf-8');
      fs.writeFileSync(OUTPUT_DIR + '/view/' + slug + '.html', makeViewerHTML(doc), 'utf-8');
    } catch(err) { console.error('  ERROR ' + file + ': ' + err.message); }
  }

  console.log('Building search index...');
  var FlexSearch = require('flexsearch');
  var si = new FlexSearch.Document({ document: { id: 'id', index: ['content'] }, tokenize: 'full' });
  docs.forEach(function(d) { si.add({ id: d.slug, content: d.text.substring(0, 100000) }); });
  fs.writeFileSync(OUTPUT_DIR + '/search-index.json', JSON.stringify(si.export()), 'utf-8');

  fs.writeFileSync(OUTPUT_DIR + '/index.html', makeIndexHTML(docs), 'utf-8');

  var llms = '# Document Repository\n\n' + docs.length + ' documents.\n\n## Documents\n\n' + docs.map(function(d) { return '- [' + d.filename + '](' + SITE_URL + '/view/' + d.slug + '.html) | Plain text: ' + SITE_URL + '/text/' + d.slug + '.txt'; }).join('\n') + '\n';
  fs.writeFileSync(OUTPUT_DIR + '/llms.txt', llms, 'utf-8');

  var sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + docs.map(function(d) { return '  <url><loc>' + SITE_URL + '/view/' + d.slug + '.html</loc></url>'; }).join('\n') + '\n</urlset>';
  fs.writeFileSync(OUTPUT_DIR + '/sitemap.xml', sitemap, 'utf-8');
  fs.writeFileSync(OUTPUT_DIR + '/robots.txt', 'User-agent: *\nAllow: /\nSitemap: ' + SITE_URL + '/sitemap.xml\n', 'utf-8');

  console.log('Done! ' + docs.length + ' documents processed.');
}

build().catch(function(e) { console.error(e); process.exit(1); });