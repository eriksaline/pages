const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../posts');
const META_EXT = '.json';
const CONTENT_EXT = '.md';

// Ensure posts directory exists
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Create a new blog post
 */
function createPost(data) {
  const { title, content, author = 'Anonymous', tags = [] } = data;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const slug = generateSlug(title);
  const now = new Date().toISOString();

  const metadata = {
    id: slug,
    title,
    slug,
    author,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: now,
    updatedAt: now,
    published: false,
  };

  const metaPath = path.join(POSTS_DIR, `${slug}${META_EXT}`);
  const contentPath = path.join(POSTS_DIR, `${slug}${CONTENT_EXT}`);

  // Check if post already exists
  if (fs.existsSync(metaPath)) {
    throw new Error(`Post with slug "${slug}" already exists`);
  }

  // Write metadata and content
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
  fs.writeFileSync(contentPath, content);

  return getPost(slug);
}

/**
 * Get a single post by slug
 */
function getPost(slug) {
  const metaPath = path.join(POSTS_DIR, `${slug}${META_EXT}`);
  const contentPath = path.join(POSTS_DIR, `${slug}${CONTENT_EXT}`);

  if (!fs.existsSync(metaPath) || !fs.existsSync(contentPath)) {
    return null;
  }

  const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const content = fs.readFileSync(contentPath, 'utf-8');

  return { ...metadata, content };
}

/**
 * Get all posts
 */
function getAllPosts(publishedOnly = false) {
  const files = fs.readdirSync(POSTS_DIR);
  const posts = [];

  for (const file of files) {
    if (file.endsWith(META_EXT)) {
      const slug = file.replace(META_EXT, '');
      const post = getPost(slug);
      if (post && (!publishedOnly || post.published)) {
        posts.push(post);
      }
    }
  }

  // Sort by createdAt descending (newest first)
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Update a blog post
 */
function updatePost(slug, data) {
  const post = getPost(slug);
  if (!post) {
    throw new Error(`Post "${slug}" not found`);
  }

  const metaPath = path.join(POSTS_DIR, `${slug}${META_EXT}`);
  const contentPath = path.join(POSTS_DIR, `${slug}${CONTENT_EXT}`);

  const metadata = { ...post, ...data, updatedAt: new Date().toISOString() };
  delete metadata.content; // Don't store content in metadata

  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
  if (data.content) {
    fs.writeFileSync(contentPath, data.content);
  }

  return getPost(slug);
}

/**
 * Delete a blog post
 */
function deletePost(slug) {
  const metaPath = path.join(POSTS_DIR, `${slug}${META_EXT}`);
  const contentPath = path.join(POSTS_DIR, `${slug}${CONTENT_EXT}`);

  if (!fs.existsSync(metaPath)) {
    throw new Error(`Post "${slug}" not found`);
  }

  fs.unlinkSync(metaPath);
  if (fs.existsSync(contentPath)) {
    fs.unlinkSync(contentPath);
  }

  return true;
}

/**
 * Publish a blog post
 */
function publishPost(slug) {
  return updatePost(slug, { published: true });
}

/**
 * Unpublish a blog post
 */
function unpublishPost(slug) {
  return updatePost(slug, { published: false });
}

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  POSTS_DIR,
};

