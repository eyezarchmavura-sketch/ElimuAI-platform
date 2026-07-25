const http = require('http');
const path = require('path');
const fs = require('fs');
const { generateStudyContent } = require('./services/aiService');

loadEnv(path.resolve(__dirname, '../../.env'));

const port = process.env.PORT || 3000;
const publicRoot = path.resolve(__dirname, '../..');
const allowedTypes = new Set(['summary', 'explain', 'quiz', 'essay', 'notes', 'translate']);
const allowedLevels = new Set(['primary', 'secondary', 'university', 'adult']);
const allowedLengths = new Set(['short', 'medium', 'long']);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const eq = trimmed.indexOf('=');
    if (eq === -1) return;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function sendFile(res, filePath) {
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(publicRoot)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(resolved, (error, data) => {
    if (error) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

async function handleGenerate(req, res) {
  const { type = 'summary', level = 'secondary', length = 'medium', input = '' } = await readJsonBody(req);
  const cleanInput = String(input).trim();

  if (!cleanInput) {
    sendJson(res, 400, { error: 'Tafadhali andika mada au maandishi kwanza.' });
    return;
  }

  if (cleanInput.length > 6000) {
    sendJson(res, 413, { error: 'Maandishi ni marefu sana kwa toleo hili la awali. Punguza hadi herufi 6000.' });
    return;
  }

  if (!allowedTypes.has(type) || !allowedLevels.has(level) || !allowedLengths.has(length)) {
    sendJson(res, 400, { error: 'Chaguo ulilotuma halitambuliki.' });
    return;
  }

  const result = await generateStudyContent({ type, level, length, input: cleanInput });
  sendJson(res, 200, result);
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      app: 'ElimuAI',
      status: 'ready',
      aiProvider: process.env.OPENAI_API_KEY ? 'openai' : 'local-fallback',
      message: 'ElimuAI backend iko tayari kusaidia wanafunzi wa Tanzania.',
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/ai/generate') {
    await handleGenerate(req, res);
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const requestPath = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const filePath = path.join(publicRoot, requestPath);
  sendFile(res, fs.existsSync(filePath) && fs.statSync(filePath).isFile() ? filePath : path.join(publicRoot, 'index.html'));
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    sendJson(res, error.message === 'Payload too large' ? 413 : 500, {
      error: error.message === 'Invalid JSON' ? 'JSON si sahihi.' : 'Tatizo la seva. Jaribu tena.',
    });
  });
});

server.listen(port, () => {
  console.log(`ElimuAI server running on http://localhost:${port}`);
});
