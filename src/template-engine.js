const { Liquid } = require('liquidjs');
const path = require('path');
const fs = require('fs');

const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Ensure templates directory exists
if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

const engine = new Liquid({
  root: TEMPLATES_DIR,
  extname: '.liquid',
});

module.exports = engine;

