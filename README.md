# 📝 Liquid Blog - GitHub Pages Blog System

A simple yet powerful blog system built with Node.js and LiquidJS. Create, edit, and publish blog posts directly from a web-based admin dashboard, with automatic static site generation for GitHub Pages.

## Features

✨ **Easy to Use**
- Beautiful web-based admin dashboard (no terminal needed!)
- Simple CRUD operations for blog posts
- Live markdown preview during editing

🚀 **Powerful**
- Built with Express.js and LiquidJS templating
- Posts stored as JSON + Markdown files (easy to version control)
- Automatic static HTML generation
- GitHub Pages integration

📱 **Responsive**
- Beautiful, mobile-friendly UI
- Clean, modern design
- Optimized templates

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install
```

### 2. Start the Dev Server

```bash
npm run dev
```

Open your browser to **http://localhost:3000** and start creating posts!

### 3. Create a Blog Post

1. Enter a **title** and **content** (markdown supported)
2. Add your **author name** and **tags**
3. Click **Create Post** to save as draft
4. Click **Publish** to make it live

### 4. Build and Publish to GitHub Pages

```bash
# Build static site to dist/
npm run build

# Deploy to GitHub Pages (requires git setup)
npm run publish
```

## Project Structure

```
pages/
├── src/
│   ├── server.js              # Express REST API
│   ├── post-manager.js        # File-based post storage
│   ├── template-engine.js     # LiquidJS setup
│   ├── build.js               # Static site generator
│   ├── publish.js             # GitHub Pages deployer
│   └── markdown-to-html.js    # Markdown converter
├── public/
│   └── index.html             # Admin dashboard
├── templates/
│   ├── index.liquid           # Blog home page
│   └── post.liquid            # Individual post page
├── posts/                     # Your blog posts
│   ├── {slug}.json            # Post metadata
│   └── {slug}.md              # Post content
├── dist/                      # Generated static site
└── package.json
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start admin server at localhost:3000 |
| `npm run build` | Generate static HTML to `dist/` |
| `npm run publish` | Build + deploy to GitHub Pages |

## Admin Dashboard

The web-based dashboard at `http://localhost:3000` provides:

### Create/Edit Posts
- Title, author, content (markdown), and tags
- Save as draft or publish immediately
- Edit existing posts anytime

### Manage Posts
- View all published and draft posts
- Publish/unpublish with one click
- Delete posts
- See creation dates and metadata

## Post Format

Posts are stored as file pairs:

**`posts/hello-world.json`** (Metadata)
```json
{
  "id": "hello-world",
  "title": "Hello World!",
  "slug": "hello-world",
  "author": "John Doe",
  "tags": ["introduction", "first-post"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "published": true
}
```

**`posts/hello-world.md`** (Content)
```markdown
# Hello World!

This is my first blog post. Here's some **bold** text and *italic* text.

## Subheading

- Bullet point 1
- Bullet point 2

```code block```
```

## Markdown Support

The blog supports standard markdown:
- **Bold**: `**text**` or `__text__`
- *Italic*: `*text*` or `_text_`
- Headers: `# H1`, `## H2`, `### H3`
- Code: `` `inline` `` or ` ``` ` blocks
- Links: `[text](url)`
- Lists: `* item` or `- item`
- Blockquotes: `> quote`

## GitHub Pages Setup

### First Time Setup

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

2. Create a GitHub repository and push this code

3. In GitHub repo settings:
   - Go to **Settings → Pages**
   - Select **gh-pages** branch as source
   - Your site will be published to `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Publishing

After creating/editing posts:

```bash
npm run publish
```

This will:
1. Build the static site to `dist/`
2. Create/update the `gh-pages` branch
3. Push to GitHub
4. Your blog will update automatically!

## Customization

### Customize Templates

Edit the templates in `templates/` to change the appearance:

- **`templates/index.liquid`** - Blog listing page
- **`templates/post.liquid`** - Individual post page

[Learn LiquidJS syntax →](https://liquidjs.com/tutorials/intro-to-liquid.html)

### Example: Custom Template Variables

In your templates, use:
```liquid
{{ post.title }}
{{ post.author }}
{{ post.createdAt | date: "%B %d, %Y" }}
{{ post.tags }}
{{ post.contentHtml }}
{{ posts }}
{{ siteTitle }}
```

### Add CSS/Assets

Place CSS or image files in an `assets/` directory, and they'll be copied to `dist/assets/` during build.

## Environment Variables

None required! The app works out of the box. Optionally set:
- `PORT` - Change the dev server port (default: 3000)

```bash
PORT=8000 npm run dev
```

## API Reference

All API endpoints are available at `http://localhost:3000/api`:

### Posts

```
GET    /api/posts                    # Get all posts
GET    /api/posts/:slug              # Get a single post
POST   /api/posts                    # Create a new post
PUT    /api/posts/:slug              # Update a post
DELETE /api/posts/:slug              # Delete a post
PUT    /api/posts/:slug/publish      # Publish a post
PUT    /api/posts/:slug/unpublish    # Unpublish a post
```

## Troubleshooting

### Posts not saving?
- Make sure the `posts/` directory exists and is writable
- Check browser console for error messages

### Build fails?
- Ensure all template files exist in `templates/`
- Check that posts have both `.json` and `.md` files

### Publish fails?
- Verify git is initialized: `git status`
- Check GitHub remote is set: `git remote -v`
- Ensure you have GitHub credentials configured

## Advanced Features

### Draft Management
- Posts are created as drafts by default
- Publish from the dashboard when ready
- Unpublished posts won't appear on the static site

### Tags
- Add multiple tags to each post
- Tags are included in post metadata
- Use in templates: `{% for tag in post.tags %}`

### Post Slug
- Automatically generated from title
- URL-friendly (lowercase, dashes, no special chars)
- Used for post URLs and file names

## Development

### Run in Development Mode

```bash
npm run dev
```

The server will start at `http://localhost:3000` with:
- Live admin dashboard
- REST API for post management
- Automatic file watching (reload browser if needed)

### Manual Build

```bash
npm run build
```

Generates static HTML files in `dist/` folder.

## License

MIT

## Support

For issues, questions, or feature requests, feel free to open an issue on GitHub!

---

**Happy blogging!** 🎉

Built with ❤️ using [LiquidJS](https://liquidjs.com) and [Express.js](https://expressjs.com)

