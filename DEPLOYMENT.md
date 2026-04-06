# GitHub Pages Blog - Deployment Guide

## Prerequisites

- Node.js and npm installed
- A GitHub account
- Git installed and configured

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., `my-blog`)
3. Choose whether to make it public or private
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### 2. Initialize Git in Your Project

```bash
cd /path/to/your/liquid-blog
git init
git add .
git commit -m "Initial commit: Liquid Blog setup"
```

### 3. Add GitHub Remote

Copy the repository URL from GitHub, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/my-blog.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `my-blog` with your actual username and repo name.

### 4. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select the **gh-pages** branch
4. Click Save

### 5. Publish Your Blog

```bash
npm run publish
```

This will:
- Build your static site to `dist/`
- Create/switch to `gh-pages` branch
- Copy all files from `dist/` to the root
- Commit and push to GitHub

### 6. Wait for Deployment

GitHub Pages usually deploys within 1-2 minutes. Your blog will be available at:

```
https://YOUR_USERNAME.github.io/my-blog/
```

---

## Continuous Publishing

Every time you create or update posts:

1. Create/edit posts in the admin dashboard
2. Publish posts when ready
3. Run `npm run publish`

Your blog will update automatically on GitHub Pages!

---

## Updating Your Domain (Optional)

To use a custom domain:

1. Go to **Settings → Pages**
2. Under "Custom domain", enter your domain
3. Follow GitHub's DNS configuration instructions
4. Click Save

---

## Troubleshooting

### "fatal: could not read Username"

Git credentials not set up. Configure them:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### "fatal: 'origin' does not appear to be a 'git' repository"

Remote not added. Add it:

```bash
git remote add origin https://github.com/YOUR_USERNAME/my-blog.git
```

### "fatal: The current branch main has no upstream branch"

First push. Use:

```bash
git push -u origin main
```

### GitHub Pages shows 404

1. Wait 1-2 minutes for deployment
2. Check that **gh-pages** branch exists
3. Verify build was successful: `npm run build`
4. Check Settings → Pages shows correct source

### Deploy shows old content

1. Clear browser cache (Ctrl+Shift+Del)
2. Wait for GitHub Pages to rebuild
3. Check commit was pushed: `git log`

---

## Project URLs

After setup, you'll have:

- **Dev Server**: http://localhost:3000 (local admin)
- **GitHub Repo**: https://github.com/YOUR_USERNAME/my-blog
- **Live Blog**: https://YOUR_USERNAME.github.io/my-blog/

---

## Next Steps

1. Create your first blog post
2. Run `npm run publish` to deploy
3. Share your blog with friends!
4. Continue adding more posts

---

## Advanced: Deploy on Every Push

You can set up GitHub Actions to auto-deploy on every push to `main`:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Blog

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Then just run `npm run build` and push - GitHub Actions will handle deployment!

---

**Happy blogging! 🎉**

