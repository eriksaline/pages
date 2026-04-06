const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const postManager = require('./post-manager');

const app = express();
const PORT = process.env.PORT || 3045;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// API Routes

/**
 * GET /api/posts
 * Get all posts with pagination and filtering
 */
app.get('/api/posts', (req, res) => {
  try {
    const published = req.query.published === 'true';
    const posts = postManager.getAllPosts(published);
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/posts/:slug
 * Get a single post by slug
 */
app.get('/api/posts/:slug', (req, res) => {
  try {
    const post = postManager.getPost(req.params.slug);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/posts
 * Create a new blog post
 */
app.post('/api/posts', (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    const post = postManager.createPost({ title, content, author, tags });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/posts/:slug
 * Update a blog post
 */
app.put('/api/posts/:slug', (req, res) => {
  try {
    const { title, content, author, tags, published } = req.body;
    const post = postManager.updatePost(req.params.slug, {
      title,
      content,
      author,
      tags,
      published,
    });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/posts/:slug
 * Delete a blog post
 */
app.delete('/api/posts/:slug', (req, res) => {
  try {
    postManager.deletePost(req.params.slug);
    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/posts/:slug/publish
 * Publish a blog post
 */
app.put('/api/posts/:slug/publish', (req, res) => {
  try {
    const post = postManager.publishPost(req.params.slug);
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/posts/:slug/unpublish
 * Unpublish a blog post
 */
app.put('/api/posts/:slug/unpublish', (req, res) => {
  try {
    const post = postManager.unpublishPost(req.params.slug);
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

/**
 * GET /
 * Serve the admin dashboard
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✨ Blog admin dashboard running at http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api\n`);
});

