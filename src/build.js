const fs = require('fs');
const path = require('path');
const postManager = require('./post-manager');
const engine = require('./template-engine');
const markdownToHtml = require('./markdown-to-html');

const DIST_DIR = path.join(__dirname, '../dist');

// Ensure dist directory exists
function ensureDistDir() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }
}

/**
 * Build the static site
 */
async function buildSite() {
  console.log('🔨 Building static site...\n');

  ensureDistDir();

  // Get all published posts
  const posts = postManager.getAllPosts(true);
  console.log(`📝 Found ${posts.length} published posts\n`);

  // Convert markdown content to HTML for each post
  const postsWithHtml = posts.map(post => ({
    ...post,
    contentHtml: markdownToHtml(post.content),
  }));

  // Build individual post pages
  for (const post of postsWithHtml) {
    const html = await buildPostPage(post);
    const postDir = path.join(DIST_DIR, post.slug);

    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    fs.writeFileSync(path.join(postDir, 'index.html'), html);
    console.log(`✅ Built post: ${post.slug}/`);
  }

  // Build index/home page
  const indexHtml = await buildIndexPage(postsWithHtml);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml);
  console.log(`✅ Built index page\n`);

  console.log('✨ Build complete! Output in ./dist/\n');
}

/**
 * Build a single post page
 */
async function buildPostPage(post) {
  const data = {
    post,
  };

  try {
    const html = await engine.parseAndRender(
      fs.readFileSync(path.join(__dirname, '../templates/post.liquid'), 'utf-8'),
      data
    );
    return html;
  } catch (error) {
    console.error(`Error building post ${post.slug}:`, error.message);
    return `<h1>Error building post</h1><p>${error.message}</p>`;
  }
}

/**
 * Build the index page with all posts
 */
async function buildIndexPage(posts) {
  const data = {
    posts,
    siteTitle: 'Blog',
    buildDate: new Date().toISOString(),
  };

  try {
    const html = await engine.parseAndRender(
      fs.readFileSync(path.join(__dirname, '../templates/index.liquid'), 'utf-8'),
      data
    );
    return html;
  } catch (error) {
    console.error('Error building index page:', error.message);
    return `<h1>Error building index page</h1><p>${error.message}</p>`;
  }
}

/**
 * Copy static assets (if any)
 */
function copyAssets() {
  const assetsDir = path.join(__dirname, '../assets');
  const distAssetsDir = path.join(DIST_DIR, 'assets');

  if (fs.existsSync(assetsDir)) {
    if (!fs.existsSync(distAssetsDir)) {
      fs.mkdirSync(distAssetsDir, { recursive: true });
    }

    const files = fs.readdirSync(assetsDir);
    for (const file of files) {
      const src = path.join(assetsDir, file);
      const dest = path.join(distAssetsDir, file);
      fs.copyFileSync(src, dest);
    }

    console.log('📦 Copied assets\n');
  }
}

// Run build
if (require.main === module) {
  buildSite()
    .then(() => {
      console.log('🎉 Site built successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Build failed:', error);
      process.exit(1);
    });
}

module.exports = { buildSite, buildPostPage, buildIndexPage };

