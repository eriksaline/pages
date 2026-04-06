#!/bin/bash

# Helper script to initialize a new GitHub Pages blog

echo "🚀 Initializing Liquid Blog..."

# Check if git is initialized
if [ ! -d .git ]; then
  echo "📦 Initializing git repository..."
  git init
fi

# Create necessary directories
mkdir -p posts public templates dist

# Install dependencies
echo "📚 Installing dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the dev server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Create your first blog post!"
echo ""
echo "To publish to GitHub Pages:"
echo "1. Create a repository on GitHub"
echo "2. Add remote: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "3. Run: npm run publish"
echo ""

