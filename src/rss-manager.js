const fs = require('fs');
const path = require('path');

const FEEDS_FILE = path.join(__dirname, '..', 'rss-feeds.json');

function loadFeeds() {
  try {
    if (fs.existsSync(FEEDS_FILE)) {
      return JSON.parse(fs.readFileSync(FEEDS_FILE, 'utf-8'));
    }
  } catch (_) {}
  return [];
}

function saveFeeds(feeds) {
  fs.writeFileSync(FEEDS_FILE, JSON.stringify(feeds, null, 2));
}

function getFeeds() {
  return loadFeeds();
}

function addFeed(url, label) {
  const feeds = loadFeeds();
  const id = 'feed-' + Date.now();
  feeds.push({ id, url, label: label || url, enabled: true });
  saveFeeds(feeds);
  return feeds;
}

function updateFeed(id, data) {
  const feeds = loadFeeds();
  const idx = feeds.findIndex(f => f.id === id);
  if (idx === -1) return null;
  feeds[idx] = { ...feeds[idx], ...data };
  saveFeeds(feeds);
  return feeds;
}

function deleteFeed(id) {
  const feeds = loadFeeds();
  const idx = feeds.findIndex(f => f.id === id);
  if (idx === -1) return null;
  const removed = feeds.splice(idx, 1)[0];
  saveFeeds(feeds);
  return removed;
}

module.exports = { getFeeds, addFeed, updateFeed, deleteFeed };
