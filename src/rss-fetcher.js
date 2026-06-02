const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const TRACKING_FILE = path.join(__dirname, '..', 'imported-entries.json');
const RSS_URL = 'https://tldr.tech/api/rss/tech';

function loadImportedEntries() {
  try {
    if (fs.existsSync(TRACKING_FILE)) {
      return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
    }
  } catch (_) {}
  return [];
}

function saveImportedEntries(entries) {
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(entries, null, 2));
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractBodyText(html) {
  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
  if (!bodyMatch) return '';
  return bodyMatch[0]
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchArticleContent(url) {
  const html = await fetchUrl(url);
  return extractBodyText(html);
}

function fetchRssFeed() {
  return new Promise((resolve, reject) => {
    https.get(RSS_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseRss(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const extract = (str, tag) => {
    const match = str.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return match ? match[1].trim() : '';
  };
  const extractCdata = (str) => {
    const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return match ? match[1].trim() : str;
  };

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const guid = extract(block, 'guid') || extract(block, 'link');
    if (!guid) continue;
    items.push({
      guid,
      title: extractCdata(extract(block, 'title')),
      link: extract(block, 'link'),
      pubDate: extract(block, 'pubDate'),
      description: extractCdata(extract(block, 'description')),
      content: extractCdata(extract(block, 'content:encoded')) || extractCdata(extract(block, 'description')),
    });
  }
  return items;
}

async function getNewEntries() {
  const xml = await fetchRssFeed();
  const allItems = parseRss(xml);
  const imported = loadImportedEntries();
  const importedSet = new Set(imported);

  const newItems = allItems.filter(item => !importedSet.has(item.guid));
  const allGuids = allItems.map(i => i.guid);

  return { newItems, allGuids };
}

function markImported(guids) {
  const current = loadImportedEntries();
  const updated = [...new Set([...current, ...guids])];
  saveImportedEntries(updated);
}

module.exports = { getNewEntries, markImported, fetchRssFeed, parseRss, fetchArticleContent };
