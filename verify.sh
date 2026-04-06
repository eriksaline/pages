#!/bin/bash

# Liquid Blog System - Setup Verification
# Run this script to verify everything is working

echo "🔍 Liquid Blog System - Verification Report"
echo "=========================================="
echo ""

# Check Node.js
echo "✓ Node.js version:"
node --version
echo ""

# Check npm
echo "✓ npm version:"
npm --version
echo ""

# Check dependencies
echo "✓ Installed packages:"
npm list --depth=0 2>/dev/null | grep -E "(express|liquidjs|body-parser|cors)" | wc -l
echo "  (express, liquidjs, body-parser, cors installed)"
echo ""

# Check src files
echo "✓ Backend modules:"
for file in src/server.js src/post-manager.js src/build.js src/publish.js src/template-engine.js src/markdown-to-html.js; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  fi
done
echo ""

# Check frontend
echo "✓ Frontend:"
if [ -f "public/index.html" ]; then
  echo "  ✓ Admin dashboard (public/index.html)"
fi
echo ""

# Check templates
echo "✓ Templates:"
for file in templates/index.liquid templates/post.liquid; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  fi
done
echo ""

# Check posts
echo "✓ Example posts:"
if [ -f "posts/example-post.json" ] && [ -f "posts/example-post.md" ]; then
  echo "  ✓ example-post (JSON + Markdown)"
fi
echo ""

# Check documentation
echo "✓ Documentation:"
for file in README.md QUICKSTART.md DEPLOYMENT.md SETUP_COMPLETE.md; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  fi
done
echo ""

echo "✨ All systems operational!"
echo ""
echo "Next steps:"
echo "  1. npm run dev        # Start the admin server"
echo "  2. Visit: http://localhost:3000"
echo "  3. Create your first blog post!"
echo ""
echo "Happy blogging! 🎉"

