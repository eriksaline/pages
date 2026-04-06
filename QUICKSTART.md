# 🚀 Liquid Blog - Getting Started Guide

## What You Have

A complete **GitHub Pages blog system** built with Node.js and LiquidJS:

✅ **Admin Dashboard** - Beautiful web UI for managing posts
✅ **REST API** - Full CRUD operations for blog posts
✅ **Static Site Generator** - Renders your posts to static HTML
✅ **GitHub Pages Integration** - Automatic deployment
✅ **File-Based Storage** - Posts saved as JSON + Markdown

---

## 5-Minute Quick Start

### 1️⃣ Start the Dev Server

```bash
npm run dev
```

You should see:
```
✨ Blog admin dashboard running at http://localhost:3000
📝 API endpoints available at http://localhost:3000/api
```

### 2️⃣ Open Admin Dashboard

Visit **http://localhost:3000** in your browser.

You'll see a beautiful admin dashboard with:
- A form to create new posts (left side)
- Your blog posts (right side)

### 3️⃣ Create Your First Post

1. Fill in the **Post Title**: "My First Post"
2. Add some **Content** (markdown supported):
   ```markdown
   # Hello World!

   This is my first blog post.

   I'm using **Liquid Blog** to power my site!
   ```
3. Add **Author**: "Your Name"
4. Add **Tags**: "blog", "first-post", "hello"
5. Click **Create Post** to save as draft
6. Click **Publish** to make it live

### 4️⃣ Build Static Site

Stop the dev server (Ctrl+C) and run:

```bash
npm run build
```

This generates static HTML files in `dist/`:
- `dist/index.html` - Blog listing page
- `dist/my-first-post/index.html` - Your post

### 5️⃣ View Your Site

Open `dist/index.html` in a browser to see your published blog!

---

## Full Workflow

### Development: Admin Dashboard
Use the web dashboard at **http://localhost:3000** to:
- ✏️ Create posts
- 📝 Edit posts
- 📤 Publish/unpublish
- 🗑️ Delete posts

### Production: Static Site
Run `npm run build` to generate static HTML for deployment.

### Deployment: GitHub Pages
```bash
npm run publish
```
This:
1. Builds the site
2. Pushes to `gh-pages` branch
3. Deploys to GitHub Pages automatically

---

## Understanding the Structure

```
posts/                          # Your blog posts
├── example-post.json          # Post metadata
└── example-post.md            # Post content

src/                           # Backend code
├── server.js                  # Express API server
├── post-manager.js            # File operations
├── build.js                   # Static generator
├── publish.js                 # GitHub Pages deployer
└── template-engine.js         # LiquidJS setup

templates/                     # HTML templates
├── index.liquid              # Blog listing
└── post.liquid               # Single post

public/                        # Frontend
└── index.html                # Admin dashboard

dist/                          # Generated static site
```

---

## Features

### 📝 Markdown Support
Write posts in markdown with support for:
- Headers, bold, italic, code blocks
- Lists, links, blockquotes
- Automatic HTML conversion

### 🏷️ Tagging System
- Add multiple tags to posts
- Tags appear on post pages
- Easy to organize content

### 📋 Draft Management
- Save posts as drafts (not published)
- Publish when ready
- Edit anytime

### 🎨 Customizable Templates
Edit `templates/` to change the design:
```liquid
{{ post.title }}
{{ post.author }}
{{ post.createdAt | date: "%B %d, %Y" }}
{{ post.contentHtml }}
```

### 🚀 GitHub Pages Ready
Deploy to GitHub Pages with one command:
```bash
npm run publish
```

---

## Common Tasks

### Edit a Post
1. Click **Edit** on any post in the dashboard
2. Modify content
3. Click **Update Post**

### Publish a Post
1. Click **Publish** next to a draft post

### Delete a Post
1. Click **Delete** on any post
2. Confirm deletion

### Customize Design
1. Edit `templates/index.liquid` (home page)
2. Edit `templates/post.liquid` (individual post)
3. Run `npm run build` to rebuild

### Add Custom CSS
1. Create `assets/` directory
2. Add your CSS files
3. They'll be copied to `dist/assets/` on build

---

## Deploying to GitHub Pages

### First Time Setup

1. Create a GitHub repository
2. Initialize git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```

3. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

4. In GitHub Settings → Pages:
   - Select **gh-pages** branch
   - Save

### Publishing Updates

After creating/editing posts:

```bash
npm run publish
```

Your blog will update automatically on GitHub Pages!

### Your Live Blog URL

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## Markdown Cheat Sheet

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold text** or __bold text__
*italic text* or _italic text_

[Link text](https://url.com)

- Bullet point
- Another point

1. Numbered item
2. Another item

> Blockquote

`inline code`

```code
code block
```
```

---

## Troubleshooting

### Dev server won't start?
```bash
# Make sure port 3000 is free
lsof -i :3000

# Or use a different port
PORT=8000 npm run dev
```

### Posts not saving?
- Check `posts/` directory exists
- Check browser console for errors
- Restart the dev server

### Build fails?
- Verify template files exist in `templates/`
- Check posts have both `.json` and `.md` files
- Look for error messages

### GitHub publish fails?
- Initialize git: `git init`
- Add remote: `git remote add origin URL`
- Ensure GitHub credentials are configured

---

## API Endpoints

If you want to integrate with other tools:

```
GET    /api/posts              # Get all posts
POST   /api/posts              # Create post
PUT    /api/posts/:slug        # Update post
DELETE /api/posts/:slug        # Delete post
PUT    /api/posts/:slug/publish    # Publish
PUT    /api/posts/:slug/unpublish  # Unpublish
```

---

## Next Steps

1. ✅ Start the dev server: `npm run dev`
2. ✅ Create a test post
3. ✅ Publish it
4. ✅ Run `npm run build`
5. ✅ Set up GitHub repository
6. ✅ Run `npm run publish` to deploy

---

## Need Help?

Check `README.md` for:
- Full API documentation
- Template customization
- Advanced features
- Troubleshooting guide

---

**Happy blogging! 🎉**

Built with ❤️ using [LiquidJS](https://liquidjs.com) and [Express](https://expressjs.com)

